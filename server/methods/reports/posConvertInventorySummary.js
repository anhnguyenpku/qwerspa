import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ConvertInventory} from '../../../imports/collection/posConvertInventory';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posConvertInventorySummaryReport(params, translate) {
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

        let convertInventoryList;
        let convertInventoryHTML = "";
        //Range Date

        convertInventoryList = Pos_ConvertInventory.aggregate([

            {
                $match: parameter
            },
            {
                $sort: {
                    date: 1
                }
            },
            {
                $group: {
                    _id: {
                        locationId: "$locationId",
                        productId: "$productId",
                    },
                    totalQty: {$sum: "$qty"},
                    data: {$push: "$convert"}
                }
            },

            {
                $project: {
                    totalQty: 1,
                    locationId: "$_id.locationId",
                    productId: "$_id.productId",
                    convert: {
                        $reduce: {
                            input: "$data",
                            initialValue: [],
                            in: {$concatArrays: ["$$value", "$$this"]}
                        }
                    }
                }
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
                        productId: "$productId",
                        locationId: "$locationId",
                        productIdTo: "$convert.productId"

                    },
                    totalQty: {$last: "$totalQty"},
                    productConvertDoc: {$last: "$productConvertDoc"},
                    totalQtyTo: {$sum: "$convert.qty"}

                }
            },
            {
                $group: {
                    _id: {
                        productId: "$_id.productId",
                        locationId: "$_id.locationId"
                    },
                    totalQty: {$last: "$totalQty"},
                    data: {$push: "$$ROOT"}
                }
            },

            {
                $lookup: {
                    from: "pos_product",
                    localField: "_id.productId",
                    foreignField: "_id",
                    as: "productDoc"
                }
            },
            {
                $unwind: {path: "$productDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $group: {
                    _id: {
                        locationId: "$_id.locationId"
                    },
                    data: {$push: "$$ROOT"}
                }
            },

            {
                $lookup: {
                    from: "pos_location",
                    localField: "_id.locationId",
                    foreignField: "_id",
                    as: "locationDoc"
                }
            },
            {
                $unwind: {path: "$locationDoc", preserveNullAndEmptyArrays: true}
            }

        ])

        if (convertInventoryList.length > 0) {
            let ind = 1;
            convertInventoryList.forEach((obj) => {
                if (obj.data.length > 0) {
                    convertInventoryHTML += `
                            <tr>
                                <th colspan="5" style="text-align: left !important;">${translate['location']} : ${obj.locationDoc.name}</th>
                            </tr>
                        `;
                    obj.data.forEach((ob) => {
                        let lnPro = ob.data.length;
                        let inc = 1;
                        ob.data.forEach((o) => {
                            if (inc === 1) {
                                convertInventoryHTML += `
                        <tr>
                              <td style="text-align: center !important;vertical-align: inherit" rowspan="${lnPro}">${ind}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit;text-align: left !important;">${ob.productDoc.name}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit;text-align: center !important;">${ob.totalQty}</td>
                                 <td style="text-align: left !important;">${o.productConvertDoc.name}</td>
                                 <td style="text-align: left">${o.totalQtyTo}</td>
                        </tr>
                `;
                            } else {

                                convertInventoryHTML += `
                        <tr>
                             
                                 <td style="text-align: left !important;">${o.productConvertDoc.name}</td>
                                 <td>${o.totalQtyTo}</td>
                        </tr>
                `;
                            }
                            inc++;

                        })


                    })

                }

                ind++;

            })
        }


        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.convertInventorySummaryHTML = convertInventoryHTML;
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
