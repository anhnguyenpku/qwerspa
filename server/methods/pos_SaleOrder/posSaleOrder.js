import {Pos_SaleOrder} from '../../../imports/collection/posSaleOrder';
import {Pos_Customer} from '../../../imports/collection/posCustomer';

import {SpaceChar} from "../../../both/config.js/space"
import {Pos_ReceivePayment} from "../../../imports/collection/posReceivePayment";
import {Acc_Journal} from "../../../imports/collection/accJournal";
import {Acc_ChartAccount} from "../../../imports/collection/accChartAccount";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";

import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {Pos_Bill} from "../../../imports/collection/posBill";
import numeral from 'numeral';

Meteor.methods({
    queryPosSaleOrder({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosSaleOrder: 0,
            };


            let companyDoc = WB_waterBillingSetup.findOne({});

            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{saleOrderNo: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {"customerDoc.name": {$regex: reg, $options: 'mi'}}];
                }
            }
            let posSaleOrders = Pos_SaleOrder.aggregate([
                {
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
                obj.total = formatCurrency(obj.total, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                return obj;
            });
            if (posSaleOrders.length > 0) {
                data.content = posSaleOrders;
                let posSaleOrderTotal = Pos_SaleOrder.find(selector).count();
                data.countPosSaleOrder = posSaleOrderTotal;
            }
            return data;
        }
    },
    queryPosSaleOrderById(id) {
        let data = Pos_SaleOrder.findOne({_id: id});
        data.saleOrderNo = data && data.saleOrderNo.length > 9 ? parseInt((data && data.saleOrderNo || "0000000000000").substr(9, 13)) : parseInt(data && data.saleOrderNo || "0");
        data.saleOrderNo = pad(data.saleOrderNo, 6);
        data.item.forEach((obj) => {
            obj.amount = formatCurrency(obj.amount);
            return obj;
        })

        return data;
    },
    queryPosSaleOrderByIdShow(id) {
        let data = Pos_SaleOrder.findOne({_id: id});
        data.saleOrderNo = data && data.saleOrderNo.length > 9 ? parseInt((data && data.saleOrderNo || "0000000000000").substr(9, 13)) : parseInt(data && data.saleOrderNo || "0");
        data.saleOrderNo = pad(data.saleOrderNo, 6);

        let companyDoc = WB_waterBillingSetup.findOne({});
        data.total = formatCurrency(data.total, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
        data.item.map(function (obj) {
            obj.price = formatCurrency(obj.price, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
            obj.amount = formatCurrency(obj.amount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
            return obj;
        })
        return data;
    },
    insertPosSaleOrder(data) {
        data.transactionType = (data.netTotal - data.paid) > 0 ? "SaleOrder" : "Sale Order Receipt";
        data.saleOrderNo = data.rolesArea + "-" + moment(data.saleOrderDate).format("YYYY") + pad(data.saleOrderNo, 6);

        data.item.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.price = numeral(obj.price).value();
            obj.cost = numeral(obj.cost).value();
            obj.totalCost = numeral(obj.totalCost).value();
            return obj;
        })

        let id = Pos_SaleOrder.insert(data);
        Pos_Customer.direct.update({_id: data.customerId}, {$inc: {saleOrderNumber: 1}});
        if (data.paid > 0) {

            let posReceivePaymentDoc = {
                totalPaid: data.paid,
                totalNetAmount: data.netTotal,
                totalDiscount: data.discountValue,

                balanceUnPaid: data.netTotal - data.paid,
                totalAmount: data.total,

                receivePaymentDate: moment(data.saleOrderDate).toDate(),
                receivePaymentDateName: moment(data.saleOrderDate).format("DD/MM/YYYY"),
                note: data.note,
                address: data.address,

                rolesArea: data.rolesArea,
                customerId: data.customerId,
                saleOrderId: id,
                saleOrderNo: data.saleOrderNo,
                canRemove: false,
                locationId: data.locationId,
                closeDate: data.netTotal - data.paid == 0 ? moment(data.saleOrderDate).toDate() : "",
                transactionType: (data.netTotal - data.paid) > 0 ? "SaleOrder" : "Sale Order Receipt"
            };

            Meteor.call("queryPosInvoiceByCustomerId", data.customerId, data.saleOrderDate, (err, result) => {
                posReceivePaymentDoc.invoice = result;
                result.forEach((obj) => {
                    posReceivePaymentDoc.balanceUnPaid += numeral(obj.amount).value();
                })
                Pos_ReceivePayment.direct.insert(posReceivePaymentDoc);
            })

        }

        return id;
    },
    updatePosSaleOrder(data, _id) {
        data.transactionType = (data.netTotal - data.paid) > 0 ? "SaleOrder" : "Sale Order Receipt";

        data.saleOrderNo = data.rolesArea + "-" + moment(data.saleOrderDate).format("YYYY") + pad(data.saleOrderNo, 6);
        let dataBeforeUpdate = Pos_SaleOrder.findOne({_id: _id});

        data.item.forEach((obj) => {
            obj.amount = numeral(obj.amount).value();
            obj.price = numeral(obj.price).value();
            obj.cost = numeral(obj.cost).value();
            obj.totalCost = numeral(obj.totalCost).value();
            return obj;
        })

        let isUpdated = Pos_SaleOrder.update({_id: _id},
            {
                $set: data
            });
        Pos_ReceivePayment.direct.remove({saleOrderId: _id});
        if (data.paid > 0) {
            let posReceivePaymentDoc = {
                    totalPaid: data.paid,
                    totalNetAmount: data.netTotal,
                    totalDiscount: data.discountValue,

                    balanceUnPaid: data.netTotal - data.paid,
                    totalAmount: data.total,

                    receivePaymentDate: moment(data.saleOrderDate).toDate(),
                    receivePaymentDateName: moment(data.saleOrderDate).format("DD/MM/YYYY"),
                    note: data.note,
                    address: data.address,

                    rolesArea: data.rolesArea,
                    customerId: data.customerId,
                    saleOrderId: _id,
                    saleOrderNo: data.saleOrderNo,
                    canRemove: false,
                    locationId: data.locationId,
                    closeDate: data.netTotal - data.paid == 0 ? moment(data.saleOrderDate).toDate() : "",
                    transactionType: (data.netTotal - data.paid) > 0 ? "SaleOrder" : "Sale Order Receipt"

                }
            ;

            Meteor.call("queryPosInvoiceByCustomerId", data.customerId, data.saleOrderDate, (err, result) => {
                posReceivePaymentDoc.invoice = result;
                result.forEach((obj) => {
                    posReceivePaymentDoc.balanceUnPaid += numeral(obj.amount).value();
                })
                Pos_ReceivePayment.direct.insert(posReceivePaymentDoc);
            })

        }

        return isUpdated;
    },
    removePosSaleOrder(id, data) {
        Pos_ReceivePayment.direct.remove({saleOrderId: id});
        Pos_Customer.direct.update({_id: data.customerId}, {$inc: {saleOrderNumber: -1}});
        let isRemoved = Pos_SaleOrder.remove({_id: id});
        return isRemoved;
    },
    pos_getSaleOrderNoByRoleAndDate(rolesAreas, date) {
        let startDate = moment(date).startOf("year").toDate();
        let endDate = moment(date).endOf("year").toDate();
        let data = Pos_SaleOrder.findOne({
            rolesArea: rolesAreas,
            saleOrderDate: {$gte: startDate, $lte: endDate}
        }, {sort: {saleOrderNo: -1}});

        let saleOrderNo = data && data.saleOrderNo.length > 9 ? parseInt((data && data.saleOrderNo || "0000000000000").substr(9, 13)) + 1 : parseInt(data && data.saleOrderNo || "0") + 1;
        return saleOrderNo + "";
    }
});

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}