import {Sch_Payment} from '../../../imports/collection/schPayment';
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import numeral from "numeral";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";

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
    updatePaymentScheduleByPayment(data, date) {
        let paymentDoc = Sch_PaymentSchedule.findOne({_id: data._id});
        let newStatus = paymentDoc.status;
        let upd = {};
        if (paymentDoc.paid + (paymentDoc.balanceNotCut || 0) + numeral(data.paid).value() + numeral(data.discount).value() >= paymentDoc.netTotal) {
            newStatus = "Complete";
            upd.closeDate = date;
        } else {
            newStatus = "Partial";
        }

        upd.status = newStatus;
        return Sch_PaymentSchedule.direct.update({_id: data._id}, {
            $set: upd,
            $inc: {
                paid: numeral(data.paid).value() + numeral(data.discount).value(),
                paymentNumber: 1
            }
        }, true);
    }

});