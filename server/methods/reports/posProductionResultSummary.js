import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ProductionResult} from '../../../imports/collection/posProductionResult';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posProductionResultSummaryReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.date = {
            $gte: moment(params.date[0]).startOf("day").toDate(),
            $lte: moment(params.date[1]).endOf("day").toDate()
        };

        let productionResultSummaryList;
        let productionResultSummaryHTML = "";
        let total = 0;
        //Range Date
        productionResultSummaryList = Pos_ProductionResult.aggregate([

            {
                $match: parameter
            },
            {
                $sort: {
                    date: 1
                }
            },
            {
                $lookup: {
                    from: "pos_location",
                    localField: "locationId",
                    foreignField: "_id",
                    as: "locationDoc"
                }
            },
            {
                $unwind: {path: "$locationDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $unwind: {path: "$convert", preserveNullAndEmptyArrays: true}
            }, {
                $lookup: {
                    from: "pos_product",
                    localField: "convert.productId",
                    foreignField: "_id",
                    as: "productConvertDoc"
                }
            }, {
                $unwind: {path: "$productConvertDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $group: {
                    _id: {
                        productDoc: "$productConvertDoc"
                    },
                    totalQty: {$sum: "$convert.qty"}
                }
            }
        ]);

        if (productionResultSummaryList.length > 0) {
            let ind = 1;
            productionResultSummaryList.forEach((obj) => {
                productionResultSummaryHTML += `
                        <tr>
                              <td style="text-align: center !important;vertical-align: inherit">${ind}</td>
                                 <td style="text-align: left !important;">${obj._id.productDoc.name}</td>
                                 <td style="text-align: left">${obj.totalQty}</td>
                        </tr>
                `;
                total += obj.totalQty;

                ind++;

            })
        }
        productionResultSummaryHTML += `
        
          <tr>
                              <td style="text-align: center !important;vertical-align: inherit" colspan="2">${translate['total']}</td>
                                 <td style="text-align: left">${total}</td>
                        </tr>
        `;

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");

        data.productionResultSummaryHTML = productionResultSummaryHTML;
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
