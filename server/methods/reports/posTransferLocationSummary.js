import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';
import {Pos_Bill} from '../../../imports/collection/posBill';
import {Pos_TransferInventory} from '../../../imports/collection/posTransferInventory';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posTransferLocationSummaryReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;
        }

        if (params.locationFromId != "") {
            parameter.locationFromId = params.locationFromId;
        }
        if (params.locationToId != "") {
            parameter.locationToId = params.locationToId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.transferInventoryDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };

        let inventoryTransferList = Pos_TransferInventory.aggregate([
            {
                $match: parameter
            },
            {
                $sort: {
                    transferInventoryDate: -1
                }
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
                        locationFromId: "$locationFromId",
                        locationToId: "$locationToId",
                        itemId: "$item.itemId",
                    },
                    itemName: {$last: "$item.itemName"},
                    qty: {$sum: "$item.qty"},
                    amount: {$sum: "$item.amount"},
                }
            },
            {
                $project: {
                    locationFromId: "$_id.locationFromId",
                    locationToId: "$_id.locationToId",
                    itemId: "$_id.itemId",
                    itemName: 1,
                    code: {
                        $let: {
                            vars: {parts: {$split: ["$itemName", " : "]}},
                            in: {
                                $arrayElemAt: ["$$parts", 0]
                            }
                        }
                    },
                    qty: 1,
                    amount: 1,
                }
            },
            {
                $sort: {
                    code: 1
                }
            },

            {
                $lookup: {
                    from: 'pos_location',
                    localField: 'locationFromId',
                    foreignField: '_id',
                    as: 'locationFromDoc'
                }
            },
            {
                $unwind: {
                    path: "$locationFromDoc",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'pos_location',
                    localField: 'locationToId',
                    foreignField: '_id',
                    as: 'locationToDoc'
                }
            },
            {
                $unwind: {
                    path: "$locationToDoc",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: {
                        locationFromId: "$locationFromDoc._id",
                        locationToId: "$locationToDoc._id",

                    },
                    locationFromDoc: {$last: "$locationFromDoc"},
                    locationToDoc: {$last: "$locationToDoc"},
                    data: {$push: "$$ROOT"}
                }

            }
            ,

            {
                $group: {
                    _id: null,
                    data: {$addToSet: "$$ROOT"}
                }
            }
        ])

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        let transferLocationSummaryHTML = "";
        let grandTotal = 0;
        if (inventoryTransferList.length > 0) {
            inventoryTransferList[0].data.forEach((obj) => {
                if (obj.data) {
                    let ind = 1;
                    let tempTransferList = "";
                    let subTotal = 0;
                    obj.data.forEach((ob) => {

                        tempTransferList += `
                    <tr>
                            <td style="text-align: left !important;">${ind}</td>
                            <td style="text-align: left !important;">${ob.itemName}</td>
                            <td style="text-align: left !important;">${ob.qty || ""}</td>
                            <td>${formatCurrency(ob.amount, companyDoc.baseCurrency)}</td>
                    </tr>                   
            
                 `
                        ind++;
                        subTotal += numeral(formatCurrency(ob.amount, companyDoc.baseCurrency)).value();


                    })
                    transferLocationSummaryHTML += `
                    <tr>
                        <th colspan="3" style="text-align: left !important;">${translate['location']} ( ${obj.locationFromDoc.code} : ${obj.locationFromDoc.name} ---> ${obj.locationToDoc.code} : ${obj.locationToDoc.name}) </th>
                        <th>${formatCurrency(subTotal, companyDoc.baseCurrency)}</th>
                    </tr>
                `;
                    transferLocationSummaryHTML += tempTransferList;


                }
            })

        }
        data.transferLocationSummaryHTML = transferLocationSummaryHTML;
        return data;
    }
})
;

