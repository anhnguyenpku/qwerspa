import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import numeral from "numeral";
import {Pos_Customer} from "../../../imports/collection/posCustomer";

Meteor.methods({
    queryPosReceivePayment({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosReceivePayment: 0,
            };

            let companyDoc = WB_waterBillingSetup.findOne({});

            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    let customerList = Pos_Customer.find({
                            name: {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }, {_id: true},
                        {
                            $limit: options.limit
                        },
                        {
                            $skip: options.skip
                        }).fetch().map((obj) => {
                        return obj._id;
                    });
                    selector.$or = [{invoiceNo: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {customerId: {$in: customerList}}];
                }
            }
            let posReceivePayments = Pos_ReceivePayment.aggregate([
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
                , {
                    $lookup: {
                        from: "pos_customer",
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
                }
            ]).map((obj) => {
                obj.totalAmount = formatCurrency(obj.totalAmount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalDiscount = formatCurrency(obj.totalDiscount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                obj.totalPaid = formatCurrency(obj.totalPaid, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                return obj;
            });
            if (posReceivePayments.length > 0) {
                data.content = posReceivePayments;
                let posReceivePaymentTotal = Pos_ReceivePayment.find(selector).count();
                data.countPosReceivePayment = posReceivePaymentTotal;
            }
            return data;
        }
    },
    queryPosReceivePaymentById(id) {
        let data = Pos_ReceivePayment.findOne({_id: id});
        return data;
    },
    insertPosReceivePayment(data) {
        data.invoice.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
            return obj;
        })

        return Pos_ReceivePayment.insert(data);
    },
    updatePosReceivePayment(data, _id) {
        data.invoice.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.rawAmount = numeral(obj.rawAmount).value();
            obj.discount = numeral(obj.discount).value();
            obj.netAmount = numeral(obj.netAmount).value();
            obj.paid = numeral(obj.paid).value();
            return obj;
        })

        return Pos_ReceivePayment.update({_id: _id},
            {
                $set: data
            });
    },
    removePosReceivePayment(id) {
        let receviePaymentDoc = Pos_ReceivePayment.findOne({_id: id});
        if (receviePaymentDoc) {
            receviePaymentDoc.invoice.forEach((data) => {
                let invoiceDoc = Pos_Invoice.findOne({_id: data._id});
                let newStatus = invoiceDoc.status;

                if (invoiceDoc.paid - (data.paid + data.discount) > 0) {
                    newStatus = "Partial";
                } else {
                    newStatus = "Active";
                }

                Pos_Invoice.direct.update({_id: data._id}, {
                    $set: {status: newStatus, closeDate: ""},
                    $inc: {
                        paid: -(data.paid + data.discount),
                        paymentNumber: -1
                    }
                }, true);

                Pos_ReceivePayment.direct.update({
                        "invoice._id": data._id,
                        createdAt: {$gt: receviePaymentDoc.createdAt}
                    },
                    {

                        $inc: {
                            "invoice.$.amount": (data.paid + data.discount),
                            "invoice.$.netAmount": (data.paid + data.discount),
                            totalAmount: (data.paid + data.discount),
                            totalNetAmount: (data.paid + data.discount),
                            balanceUnPaid: (data.paid + data.discount)
                        }
                    }, {multi: true}, true);
            })
        }
        return Pos_ReceivePayment.remove({_id: id});


    },
    queryPosInvoiceByCustomerId(customerId, receiveDate, locationId) {
        return Pos_Invoice.find({
            customerId: customerId,
            locationId: locationId,
            status: {$in: ["Active", "Partial"]}
        }).fetch().map((obj) => {
            if (obj) {
                return {
                    _id: obj._id,
                    invoiceNo: obj.invoiceNo,
                    termId: obj.termId,
                    amount: formatCurrency(obj.netTotal - obj.paid - (obj.balanceNotCut || 0)),
                    rawAmount: obj.total,
                    isApplyTerm: false,
                    discount: 0,
                    invoiceDate: obj.invoiceDate,
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
    /*queryPosInvoiceByCustomerIdSubmit(customerId, receiveDate) {
        return Pos_Invoice.find({customerId: customerId, status: {$in: ["Active", "Partial"]}}).fetch().map((obj) => {
            return {
                _id: obj._id,
                invoiceNo: obj.invoiceNo,
                termId: obj.termId,
                amount: obj.netTotal,
                rawAmount: obj.total,
                isApplyTerm: false,
                discount: obj.discount,
                invoiceDate: obj.invoiceDate,
                dueDate: obj.dueDate,
                netAmount: obj.netTotal,
                paid: obj.paid,
                isShow: obj.isShow,
                isPaid: obj.isPaid,
                dayOverDue: moment(receiveDate).startOf("days").diff(moment(obj.dueDate).startOf("days").toDate(), "days") < 0 ? 0 : moment(receiveDate).startOf("day").diff(moment(obj.dueDate).startOf("days").toDate(), "days")
            }
        });
    },*/
    updateInvoiceByReceivePayment(data, date) {
        let invoiceDoc = Pos_Invoice.findOne({_id: data._id});
        let newStatus = invoiceDoc.status;
        let upd = {};
        if (invoiceDoc.paid + (invoiceDoc.balanceNotCut || 0) + numeral(data.paid).value() + numeral(data.discount).value() >= invoiceDoc.netTotal) {
            newStatus = "Complete";
            upd.closeDate = date;
        } else {
            newStatus = "Partial";
        }

        upd.status = newStatus;
        return Pos_Invoice.direct.update({_id: data._id}, {
            $set: upd,
            $inc: {
                paid: numeral(data.paid).value() + numeral(data.discount).value(),
                paymentNumber: 1
            }
        }, true);
    }

});