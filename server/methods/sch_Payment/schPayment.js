import {Sch_Payment} from '../../../imports/collection/schPayment';
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import numeral from "numeral";

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
                    selector.$or = [{paymentNo: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {"customerDoc.name": {$regex: reg, $options: 'mi'}}];
                }
            }
            let schPayments = Sch_Payment.aggregate([
                {
                    $lookup: {
                        from: "sch_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$customerDoc",
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
            if (schPayments.length > 0) {
                data.content = schPayments;
                let schPaymentTotal = Sch_Payment.find(selector).count();
                data.countSchPayment = schPaymentTotal;
            }
            return data;
        }
    },
    querySchPaymentById(id) {
        let data = Sch_Payment.findOne({_id: id});
        return data;
    },
    insertSchPayment(data) {
        data.payment.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
            return obj;
        })

        return Sch_Payment.insert(data);
    },
    updateSchPayment(data, _id) {
        data.payment.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
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
            paymentDoc.payment.forEach((data) => {
                let paymentDoc = Sch_Payment.findOne({_id: data._id});
                let newStatus = paymentDoc.status;

                if (paymentDoc.paid - (data.paid + data.discount) > 0) {
                    newStatus = "Partial";
                } else {
                    newStatus = "Active";
                }

                Sch_Payment.direct.update({_id: data._id}, {
                    $set: {status: newStatus, closeDate: ""},
                    $inc: {
                        paid: -(data.paid + data.discount),
                        paymentNumber: -1
                    }
                }, true);

                Sch_Payment.direct.update({
                        "payment._id": data._id,
                        createdAt: {$gt: paymentDoc.createdAt}
                    },
                    {

                        $inc: {
                            "payment.$.amount": (data.paid + data.discount),
                            "payment.$.netAmount": (data.paid + data.discount),
                            totalAmount: (data.paid + data.discount),
                            totalNetAmount: (data.paid + data.discount),
                            balanceUnPaid: (data.paid + data.discount)
                        }
                    }, {multi: true}, true);
            })
        }
        return Sch_Payment.remove({_id: id});


    },
    querySchPaymentByStudentId(studentId, receiveDate, locationId) {
        return Sch_Payment.find({
            customerId: customerId,
            locationId: locationId,
            status: {$in: ["Active", "Partial"]}
        }).fetch().map((obj) => {
            if (obj) {
                return {
                    _id: obj._id,
                    paymentNo: obj.paymentNo,
                    termId: obj.termId,
                    amount: formatCurrency(obj.netTotal - obj.paid - (obj.balanceNotCut || 0)),
                    rawAmount: obj.total,
                    isApplyTerm: false,
                    discount: 0,
                    paymentDate: obj.paymentDate,
                    dueDate: obj.dueDate,
                    netAmount: formatCurrency(obj.netTotal - obj.paid - (obj.balanceNotCut || 0)),
                    paid: 0,
                    isShow: true,
                    isPaid: false,
                    dayOverDue: moment(receiveDate).startOf("days").diff(moment(obj.dueDate).startOf("days").toDate(), "days") < 0 ? 0 : moment(receiveDate).startOf("day").diff(moment(obj.dueDate).startOf("days").toDate(), "days")
                }
            }
            return [];
        });
    },
    /*querySchPaymentByCustomerIdSubmit(customerId, receiveDate) {
        return Sch_Payment.find({customerId: customerId, status: {$in: ["Active", "Partial"]}}).fetch().map((obj) => {
            return {
                _id: obj._id,
                paymentNo: obj.paymentNo,
                termId: obj.termId,
                amount: obj.netTotal,
                rawAmount: obj.total,
                isApplyTerm: false,
                discount: obj.discount,
                paymentDate: obj.paymentDate,
                dueDate: obj.dueDate,
                netAmount: obj.netTotal,
                paid: obj.paid,
                isShow: obj.isShow,
                isPaid: obj.isPaid,
                dayOverDue: moment(receiveDate).startOf("days").diff(moment(obj.dueDate).startOf("days").toDate(), "days") < 0 ? 0 : moment(receiveDate).startOf("day").diff(moment(obj.dueDate).startOf("days").toDate(), "days")
            }
        });
    },*/
    updatePaymentByPayment(data, date) {
        let paymentDoc = Sch_Payment.findOne({_id: data._id});
        let newStatus = paymentDoc.status;
        let upd = {};
        if (paymentDoc.paid + (paymentDoc.balanceNotCut || 0) + numeral(data.paid).value() + numeral(data.discount).value() >= paymentDoc.netTotal) {
            newStatus = "Complete";
            upd.closeDate = date;
        } else {
            newStatus = "Partial";
        }

        upd.status = newStatus;
        return Sch_Payment.direct.update({_id: data._id}, {
            $set: upd,
            $inc: {
                paid: numeral(data.paid).value() + numeral(data.discount).value(),
                paymentNumber: 1
            }
        }, true);
    }

});