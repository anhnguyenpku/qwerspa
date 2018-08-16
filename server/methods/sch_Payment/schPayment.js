import {Sch_Payment} from '../../../imports/collection/schPayment';
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import numeral from "numeral";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";
import {Pos_Invoice} from "../../../imports/collection/posInvoice";

Meteor.methods({
    querySchPayment({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchPayment: 0,
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
            let schPayments = Sch_Payment.aggregate([
                
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
                },
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
                }
            ]).map((obj) => {
                obj.totalAmount = formatCurrency(obj.totalAmount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalDiscount = formatCurrency(obj.totalDiscount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalPaid = formatCurrency(obj.totalPaid, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                return obj;
            });
            if (schPayments.length > 0) {
                data.content = schPayments;
                let schPaymentTotal = Sch_Payment.aggregate([
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
                data.countSchPayment = schPaymentTotal[0].total;
            }
            return data;
        }
    },
    querySchPaymentById(id) {
        let data = Sch_Payment.findOne({_id: id});
        return data;
    },
    insertSchPayment(data) {
        data.schedule.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
            obj.waived = numeral(obj.waived).value();
            return obj;
        });

        return Sch_Payment.insert(data);
    },
    updateSchPayment(data, _id) {
        data.schedule.map((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
            obj.waived = numeral(obj.waived).value();
            return obj;
        });

        return Sch_Payment.update({_id: _id},
            {
                $set: data
            });
    },
    removeSchPayment(id) {
        let paymentDoc = Sch_Payment.findOne({_id: id});
        if (paymentDoc) {
            paymentDoc.schedule.forEach((data) => {
                let paymentDoc = Sch_PaymentSchedule.findOne({_id: data._id});
                let newStatus = paymentDoc.status;

                if (paymentDoc.paid - (data.paid + data.discount) > 0) {
                    newStatus = "Partial";
                } else {
                    newStatus = "Active";
                }

                Sch_PaymentSchedule.direct.update({_id: data._id}, {
                    $set: {status: newStatus, closeDate: ""},
                    $inc: {
                        paid: -(data.paid),
                        discount: -(data.discount),
                        waived: -(data.waived || 0),
                        paymentNumber: -1
                    }
                }, true);

                Sch_Payment.direct.update({
                        "schedule._id": data._id,
                        createdAt: {$gt: paymentDoc.createdAt}
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
        return Sch_Payment.remove({_id: id});


    },
    updatePaymentScheduleByPayment(data, date) {
        let paymentDoc = Sch_PaymentSchedule.findOne({_id: data._id});
        let newStatus = paymentDoc.status;
        let upd = {};
        if (paymentDoc.paid + paymentDoc.discount + (paymentDoc.waived || 0) + (paymentDoc.balanceNotCut || 0) + numeral(data.paid).value() + numeral(data.discount).value() + numeral(data.waived || 0).value() >= paymentDoc.amount) {
            newStatus = "Complete";
            upd.closeDate = date;
        } else {
            newStatus = "Partial";
        }

        upd.status = newStatus;
        return Sch_PaymentSchedule.direct.update({_id: data._id}, {
            $set: upd,
            $inc: {
                paid: numeral(data.paid).value(),
                discount: numeral(data.discount).value(),
                waived: numeral(data.waived || 0).value(),
                paymentNumber: 1
            }
        }, true);
    },

    sch_getPaymentNoByRoleAndDate(rolesAreas, date) {
        let startDate = moment(date).startOf("year").toDate();
        let endDate = moment(date).endOf("year").toDate();
        let data = Sch_Payment.findOne({
            rolesArea: rolesAreas,
            paymentDate: {$gte: startDate, $lte: endDate}
        }, {sort: {paymentNo: -1}});

        let paymentNo = data && data.paymentNo.length > 9 ? parseInt((data && data.paymentNo || "0000000000000").substr(9, 13)) + 1 : parseInt(data && data.paymentNo || "0") + 1;
        return paymentNo + "";
    },

});