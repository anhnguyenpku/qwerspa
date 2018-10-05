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
    posDebtSummaryReport(params, translate) {
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
        let parameter2 = {};
        parameter2.$or = [
            {
                "receiveDoc.receivePaymentDate": {
                    $exists: false
                }
            },
            {
                "receiveDoc.receivePaymentDate": {
                    $lt: moment(params.date).endOf("day").toDate()
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
                    paid: 1
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
                }
            },
            {
                $lookup: {
                    from: 'pos_receivePayment',
                    localField: '_id.customerId',
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
                    receiveDoc: {$last: "$receiveDoc"}
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
                    data: {$push: "$$ROOT"},
                    total: {$sum: "$invoiceTotal"}
                }
            }
        ]);


        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        let debtHTML = "";
        let grandTotal = 0;
        let grandDiscount = 0;
        let grandUnpaid = 0;
        let grandPaid = 0;
        let ind = 1;
        if (debtList.length > 0) {
            debtList[0].data.forEach((obj) => {
                if ((obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || (obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid) > 0) {
                    debtHTML += `
                    <tr>
                            <td style="text-align: left !important;">${ind}</td>
                            <td style="text-align: left !important;">${obj.customerDoc.name}</td>
                            <td style="text-align: left !important;">${obj.customerDoc && obj.customerDoc.phoneNumber || ""}</td>
                            <td>${formatCurrency(obj.invoiceTotal, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(obj.invoiceDiscount + (obj.receiveDoc && obj.receiveDoc.totalDiscount) || 0, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(obj.invoiceTotal - (obj.invoiceDiscount + (obj.receiveDoc && obj.receiveDoc.totalDiscount) || 0) - ((obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid), companyDoc.baseCurrency)}</td>

                            <td>${formatCurrency((obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || (obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid), companyDoc.baseCurrency)}</td>
                    </tr>
            
                 `
                    grandTotal += obj.invoiceTotal;
                    grandPaid += obj.invoiceTotal - (obj.invoiceDiscount + (obj.receiveDoc && obj.receiveDoc.totalDiscount) || 0) - ((obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || (obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid));
                    grandDiscount += obj.invoiceDiscount + (obj.receiveDoc && obj.receiveDoc.totalDiscount) || 0;
                    grandUnpaid += (obj.receiveDoc && obj.receiveDoc.balanceUnPaid) || (obj.invoiceTotal - obj.invoiceDiscount - obj.invoicePaid);
                    ind++;
                }
            })

            debtHTML += `
            <tr>
                <th colspan="3">${translate['grandTotal']}</th>
                 <td>${formatCurrency(grandTotal, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandDiscount, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandPaid, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandUnpaid, companyDoc.baseCurrency)}</td>
            </tr>
`
        }
        data.debtHTML = debtHTML;
        return data;
    }
})
;

