import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {Pos_Bill} from "../../../imports/collection/posBill";

Meteor.methods({
    posPurchaseSaleByProductSummaryReport(params, translate) {
        let parameter = {};
        let purchaseSaleHTML = "";

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.invoiceDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };


        //Range Date
        let saleList = Pos_Invoice.aggregate([

            {
                $match: parameter
            },

            {
                $unwind: {
                    path: "$item",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    itemId: "$item.itemId",
                    itemName: "$item.itemName",
                    amount: "$item.amount",
                    item: {
                        $let: {
                            vars: {parts: {$split: ["$item.itemName", " : "]}},
                            in: {
                                $arrayElemAt: ["$$parts", 1]
                            }
                        }
                    },
                }
            },

            {
                $group: {
                    _id: {
                        itemId: "$itemId",
                        itemName: "$itemName",
                        item: "$item"
                    },
                    total: {$sum: "$amount"},
                }
            },
            {
                $sort: {
                    "_id.item": 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    total: {$sum: "$total"}
                }
            }
        ]);

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        purchaseSaleHTML += `
            <tr>
                <th colspan="3" style="text-align: left !important;">${translate['sale']}</th>
            </tr>
`

        if (saleList.length > 0) {
            let ind = 1;
            saleList[0].data.forEach((obj) => {
                purchaseSaleHTML += `
                    <tr>
                                                                    <td style="text-align: center !important;">${ind}</td>

                            <td style="text-align: left !important;">${obj._id.itemName}</td>
                            <td>${formatCurrency(obj.total, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
            })
            purchaseSaleHTML += `
            <tr>
                <th colspan="2">${translate['totalSale']}</th>
                 <td>${formatCurrency(saleList[0].total, companyDoc.baseCurrency)}</td>
            </tr>
`

        }


        let paramPurchase = {};

        if (params.area !== "") {
            paramPurchase.rolesArea = params.area;

        }
        paramPurchase.billDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };
        //Range Date
        let purchaseList = Pos_Bill.aggregate([

            {
                $match: paramPurchase
            },

            {
                $unwind: {
                    path: "$item",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        itemId: "$item.itemId",
                        itemName: "$item.itemName"
                    },
                    total: {$sum: "$item.amount"},
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$addToSet: "$$ROOT"},
                    total: {$sum: "$total"}
                }
            }
        ])


        purchaseSaleHTML += `
            <tr>
                <th colspan="3" style="text-align: left !important;">${translate['purchase']}</th>
            </tr>
`

        if (purchaseList.length > 0) {
            let ind = 1;
            purchaseList[0].data.forEach((obj) => {
                purchaseSaleHTML += `
                    <tr>
                                                <td style="text-align: center !important;">${ind}</td>

                            <td style="text-align: left !important;">${obj._id.itemName}</td>
                            <td>${formatCurrency(obj.total, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
            })
            purchaseSaleHTML += `
            <tr>
                <th colspan="2">${translate['totalPurchase']}</th>
                 <td>${formatCurrency(purchaseList[0].total, companyDoc.baseCurrency)}</td>
            </tr>
`
        }


        purchaseSaleHTML += `
            <tr>
                <th colspan="2">${translate['grandTotal']}</th>
                 <td>${formatCurrency((((saleList.length > 0 && saleList[0].total) || 0) - (purchaseList.length > 0 && purchaseList[0].total) || 0), companyDoc.baseCurrency)}</td>
            </tr>
`

        data.purchaseSaleHTML = purchaseSaleHTML;
        return data;
    }
})
;

