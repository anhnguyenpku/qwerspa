import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posDebtDetailReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.invoiceDate = {
            $lte: moment(params.date).endOf("day").toDate(),
        };

        parameter.$or = [
            {
                closeDate: {
                    $exists: false
                }
            },
            {
                status: {$ne: "Complete"}
            },
            {
                closeDate: {
                    $gt: moment(params.date).endOf("day").toDate()
                }
            }
        ];
        let debtList = Pos_Invoice.aggregate([
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
                $project: {
                    customerId: 1,
                    total: 1,
                    discountValue: 1,
                    paid: 1,
                    netTotal: 1,
                    invoiceNo: 1,
                    dueDate: 1,
                    invoiceDate: 1
                }
            },
            {
                $group: {
                    _id: {
                        customerId: "$customerId"

                    },
                    invoiceTotal: {$sum: "$total"},
                    invoiceDiscount: {$sum: "$discountValue"},
                    invoicePaid: {$sum: "$paid"},
                    lastInvoiceNo: {$last: "$invoiceNo"},
                    lastInvoiceDate: {$last: "$invoiceDate"},
                    data: {$addToSet: "$$ROOT"}
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
        let debtHTML = "";
        let grandTotal = 0;
        let grandUnpaid = 0;
        let ind = 1;
        if (debtList.length > 0) {
            debtList[0].data.forEach((obj) => {

                debtHTML += `
                    <tr>
                            <td style="text-align: left !important;">${ind}</td>
                            <td style="text-align: left !important;">${obj.customerDoc.name}</td>
                            <td style="text-align: left !important;">${obj.customerDoc.phoneNumber || ""}</td>
                            <td>${formatCurrency((obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid), companyDoc.baseCurrency)}</td>
                    </tr>
            
                 `;
                ind++;
                obj.data.forEach((ob) => {
                    if (ob.netTotal - ob.paid > 0) {
                        ob.invoiceNo = ob && ob.invoiceNo.length > 9 ? parseInt((ob && ob.invoiceNo || "0000000000000").substr(9, 13)) : parseInt(ob && ob.invoiceNo || "0");
                        ob.invoiceNo = pad(ob.invoiceNo, 6);
                        if (ob.dueDate.getTime() >= params.date.getTime()) {
                            debtHTML += `
                        <tr>
                            <td colspan="3" style="text-align: center !important;">${moment(ob.invoiceDate).format("DD/MM/YYYY")}-(#${ob.invoiceNo})</td>
                            <td style="text-align: left !important;">${formatCurrency(ob.netTotal - ob.paid, companyDoc.baseCurrency)}</td>
                        </tr>
                    
                    `;
                        } else {
                            debtHTML += `
                        <tr>
                            <td colspan="3" style="text-align: center !important;">${moment(ob.invoiceDate).format("DD/MM/YYYY")}-(#${ob.invoiceNo})</td>
                            <td style="text-align: left !important;color: red !important;">${formatCurrency(ob.netTotal - ob.paid, companyDoc.baseCurrency)}</td>
                        </tr>
                    
                    `;
                        }
                    }
                });


                grandTotal += obj.invoiceTotal;
                grandUnpaid += obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid;
            });

            debtHTML += `
            <tr>
                <th colspan="3">${translate['grandTotal']}</th>
                 <td>${formatCurrency(grandUnpaid, companyDoc.baseCurrency)}</td>
            </tr>
`
        }
        data.debtHTML = debtHTML;
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