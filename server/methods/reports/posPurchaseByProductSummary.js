import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_Bill} from '../../../imports/collection/posBill';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posPurchaseByProductSummaryReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.billDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };


        //Range Date
        let purchaseList = Pos_Bill.aggregate([

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
                $group: {
                    _id: {
                        itemId: "$item.itemId",
                        itemName: "$item.itemName"
                    },
                    total: {$sum: "$item.amount"},
                    totalQty: {$sum: "$item.qty"},
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

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        let purchaseHTML = "";
        if (purchaseList.length > 0) {
            let ind = 1;
            purchaseList[0].data.forEach((obj) => {
                purchaseHTML += `
                    <tr>
                                                                                        <td style="text-align: center !important;">${ind}</td>

                            <td style="text-align: left !important;">${obj._id.itemName}</td>
                            <td style="text-align: left !important;">${obj.totalQty}</td>
                            <td>${formatCurrency(obj.total, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
            })
            purchaseHTML += `
            <tr>
                <th colspan="3">${translate['grandTotal']}</th>
                 <td>${formatCurrency(purchaseList[0].total, companyDoc.baseCurrency)}</td>
            </tr>
`

        }
        data.purchaseHTML = purchaseHTML;
        return data;
    }
})
;
