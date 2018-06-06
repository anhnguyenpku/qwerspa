import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';
import {Pos_Customer} from '../../../imports/collection/posCustomer';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posTransactionListByCustomerReport(params) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter["invoiceDoc.invoiceDate"] = {
            $gte: moment(params.date[0]).startOf("day").toDate(),
            $lte: moment(params.date[1]).endOf("day").toDate(),
        };

        let parameter2 = {};
        parameter["invoiceDoc.receivePaymentDate"] = {
            $gte: moment(params.date[0]).startOf("day").toDate(),
            $lte: moment(params.date[1]).endOf("day").toDate(),
        };

        let transactionListByCustomerList = Pos_Customer.aggregate([
            {
                $project: {

                    name: 1,
                    phoneNumber: 1,
                }
            },

            {
                $lookup: {
                    from: "pos_invoice",
                    localField: "_id",
                    foreignField: "customerId",
                    as: "invoiceDoc"

                }
            },
            {
              $unwind:{
                  path:"$invoiceDoc"
              }
            },
            {
                $match: parameter
            },
            {
                $sort: {
                    invoiceDate: 1,
                    createdAt: 1
                }
            },
            {
                $lookup: {
                    from: 'pos_receivePayment',
                    localField: '_id',
                    foreignField: 'customerId',
                    as: 'receiveDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$receiveDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: parameter2
            },
            {
                $sort: {
                    "receiveDoc.receivePaymentDate": 1,
                    "receiveDoc.createdAt": 1
                }
            },
            {
                $group: {
                    _id: {
                        customerId: "$_id.customerId"
                    },
                    invoiceTotal: {$last: "$invoiceTotal"},
                    invoiceDiscount: {$last: "$invoiceDiscount"},
                    invoicePaid: {$last: "$invoicePaid"},
                    receiveDoc: {$last: "$receiveDoc"},
                    lastInvoiceNo: {$last: "$lastInvoiceNo"},
                    lastInvoiceDate: {$last: "$lastInvoiceDate"}
                }
            },

            {
                $lookup:
                    {
                        from: "pos_customer",
                        localField: "_id.customerId",
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
                $sort: {
                    "customerDoc.name": 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$addToSet: "$$ROOT"},
                    total: {$sum: "$invoiceTotal"}
                }
            }
        ])
        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        let transactionListByCustomerHTML = "";
        let grandTotal = 0;
        let grandUnpaid = 0;
        let ind = 1;
        if (transactionListByCustomerList.length > 0) {
            transactionListByCustomerList[0].data.forEach((obj) => {

                if (obj.receiveDoc == undefined || obj.receiveDoc == null) {
                    obj.invoiceDiscount = 0;
                    obj.invoicePaid = 0;
                }
                transactionListByCustomerHTML += `
                    <tr>
                            <td style="text-align: left !important;">${ind}</td>
                            <th style="text-align: left !important;">${obj.customerDoc.name}</th>
                            <th style="text-align: left !important;">${obj.customerDoc.phoneNumber}</th>
                            <td>${formatCurrency(obj.invoiceTotal, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency((obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid, companyDoc.baseCurrency)}</td>
                    </tr>
            
                 `
                if (obj.receiveDoc && obj.receiveDoc.invoice.length > 0) {
                    obj.receiveDoc.invoice.forEach((ob) => {
                        if (ob.netAmount - ob.paid > 0) {

                            ob.invoiceNo = ob && ob.invoiceNo.length > 9 ? parseInt((ob && ob.invoiceNo || "0000000000000").substr(9, 13)) : parseInt(ob && ob.invoiceNo || "0");
                            ob.invoiceNo = pad(ob.invoiceNo, 6);
                            transactionListByCustomerHTML += `
                        <tr>
                            <td colspan="3" style="text-align: center !important;">${moment(ob.invoiceDate).format("DD/MM/YYYY")}-(#${ob.invoiceNo})</td>
                            <td>${formatCurrency(ob.rawAmount, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(ob.netAmount - ob.paid, companyDoc.baseCurrency)}</td>
                        </tr>
                    
                    `
                        }
                    })
                } else {
                    obj.lastInvoiceNo = obj && obj.lastInvoiceNo.length > 9 ? parseInt((obj && obj.lastInvoiceNo || "0000000000000").substr(9, 13)) : parseInt(obj && obj.lastInvoiceNo || "0");
                    obj.lastInvoiceNo = pad(obj.lastInvoiceNo, 6);
                    transactionListByCustomerHTML += `
                        <tr>
                            <td colspan="3" style="text-align: center !important;">${moment(obj.lastInvoiceDate).format("DD/MM/YYYY")}-(#${obj.lastInvoiceNo})</td>
                            <td>${formatCurrency(obj.invoiceTotal, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid, companyDoc.baseCurrency)}</td>
                        </tr>
                    
                    `
                }


                grandTotal += obj.invoiceTotal;
                grandUnpaid += (obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid;
                ind++;
            })

            transactionListByCustomerHTML += `
            <tr>
                <th colspan="3">Grand Total</th>
                 <td>${formatCurrency(grandTotal, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandUnpaid, companyDoc.baseCurrency)}</td>
            </tr>
`
        }
        data.transactionListByCustomerHTML = transactionListByCustomerHTML;
        return data;
    }
})
;

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}