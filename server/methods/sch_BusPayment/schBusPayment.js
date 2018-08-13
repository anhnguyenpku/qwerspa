import {Sch_BusPayment} from '../../../imports/collection/schBusPayment';
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import numeral from "numeral";
import {Sch_BusRegister} from "../../../imports/collection/schBusRegister";

Meteor.methods({
    querySchBusPayment({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchBusPayment: 0,
            };

            let companyDoc = WB_waterBillingSetup.findOne({});

            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{"studentDoc.personal.name": {$regex: reg, $options: 'mi'}}];
                }
            }
            let schBusPayments = Sch_BusPayment.aggregate([
                {
                    $lookup: {
                        from: "sch_student",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "studentDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$studentDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: selector
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]).map((obj) => {
                obj.totalAmount = formatCurrency(obj.totalAmount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalDiscount = formatCurrency(obj.totalDiscount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalPaid = formatCurrency(obj.totalPaid, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                return obj;
            });
            if (schBusPayments.length > 0) {
                data.content = schBusPayments;
                let schBusPaymentTotal = Sch_BusPayment.aggregate([
                    {
                        $lookup: {
                            from: "sch_student",
                            localField: "studentId",
                            foreignField: "_id",
                            as: "studentDoc"
                        }
                    },
                    {
                        $unwind: {
                            path: "$studentDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: selector
                    },
                    {$group: {_id: null, total: {$sum: 1}}},
                ]);
                data.countSchBusPayment = schBusPaymentTotal[0].total;
            }
            return data;
        }
    },
    querySchBusPaymentById(id) {
        let data = Sch_BusPayment.findOne({_id: id});
        return data;
    },
    insertSchBusPayment(data) {
        data.schedule.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.paid = numeral(obj.paid).value();
            obj.waived = numeral(obj.waived).value();
            return obj;
        });

        return Sch_BusPayment.insert(data);
    },
    updateSchBusPayment(data, _id) {
        data.schedule.map((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.paid = numeral(obj.paid).value();
            obj.waived = numeral(obj.waived).value();
            return obj;
        });

        return Sch_BusPayment.update({_id: _id},
            {
                $set: data
            });
    },
    removeSchBusPayment(id) {
        let busPaymentDoc = Sch_BusPayment.findOne({_id: id});
        if (busPaymentDoc) {
            busPaymentDoc.schedule.forEach((data) => {
                let busPaymentDoc = Sch_BusPaymentSchedule.findOne({_id: data._id});
                let newStatus = busPaymentDoc.status;

                if (busPaymentDoc.paid - (data.paid + data.discount) > 0) {
                    newStatus = "Partial";
                } else {
                    newStatus = "Active";
                }

                Sch_BusPaymentSchedule.direct.update({_id: data._id}, {
                    $set: {status: newStatus, closeDate: ""},
                    $inc: {
                        paid: -(data.paid),
                        discount: -(data.discount),
                        waived: -(data.waived || 0),
                        busPaymentNumber: -1
                    }
                }, true);

                Sch_BusPayment.direct.update({
                        "schedule._id": data._id,
                        createdAt: {$gt: busPaymentDoc.createdAt}
                    },
                    {

                        $inc: {
                            "schedule.$.amount": (data.paid + data.discount + (data.waived || 0)),
                            "schedule.$.netAmount": (data.paid + data.discount + (data.waived || 0)),
                            totalAmount: (data.paid + data.discount + (data.waived || 0)),
                            totalNetAmount: (data.paid + data.discount + (data.waived || 0)),
                            balanceUnPaid: (data.paid + data.discount + (data.waived || 0))
                        }
                    }, {multi: true}, true);
            })
        }
        return Sch_BusPayment.remove({_id: id});


    },
    updateBusPaymentScheduleByBusPayment(data, date) {
        let busPaymentDoc = Sch_BusPaymentSchedule.findOne({_id: data._id});
        let newStatus = busPaymentDoc.status;
        let upd = {};
        if (busPaymentDoc.paid + busPaymentDoc.discount + (busPaymentDoc.waived || 0) + (busPaymentDoc.balanceNotCut || 0) + numeral(data.paid).value() + numeral(data.discount).value() + numeral(data.waived || 0).value() >= busPaymentDoc.amount) {
            newStatus = "Complete";
            upd.closeDate = date;
        } else {
            newStatus = "Partial";
        }

        upd.status = newStatus;
        return Sch_BusPaymentSchedule.direct.update({_id: data._id}, {
            $set: upd,
            $inc: {
                paid: numeral(data.paid).value(),
                discount: numeral(data.discount).value(),
                waived: numeral(data.waived || 0).value(),
                busPaymentNumber: 1
            }
        }, true);
    },

    sch_getBusPaymentNoByRoleAndDate(rolesAreas, date) {
        let startDate = moment(date).startOf("year").toDate();
        let endDate = moment(date).endOf("year").toDate();
        let data = Sch_BusPayment.findOne({
            rolesArea: rolesAreas,
            busPaymentDate: {$gte: startDate, $lte: endDate}
        }, {sort: {busPaymentNo: -1}});

        let busPaymentNo = data && data.busPaymentNo.length > 9 ? parseInt((data && data.busPaymentNo || "0000000000000").substr(9, 13)) + 1 : parseInt(data && data.busPaymentNo || "0") + 1;
        return busPaymentNo + "";
    },
    querySchBusPaymentScheduleByRegisterId(busRegisterId, receiveDate) {
        let data = Sch_BusRegister.findOne({_id: busRegisterId});
        let list = [];
        let lDate = data.dueDate;
        while (lDate.getTime() <= receiveDate.getTime()) {
            list.push({
                amount: formatCurrency(data.price),
                paid: 0,
                isPaid: false,
                desc: "",
                waived: 0,
                dueDate: lDate,
                dayOverDue: moment(receiveDate).startOf("days").diff(moment(lDate).startOf("days").toDate(), "days") < 0 ? 0 : moment(receiveDate).startOf("days").diff(moment(lDate).startOf("days").toDate(), "days")
            });
            lDate = moment(lDate).add(1, "months").toDate();
        }
        data.list = list;
        return data;
    }

});