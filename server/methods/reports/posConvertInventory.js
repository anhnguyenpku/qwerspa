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
    posConvertInventoryReport(params, translate) {
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
        let total = 0;
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
                $lookup: {
                    from: "pos_product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDoc"
                }
            },
            {
                $unwind: {path: "$productDoc", preserveNullAndEmptyArrays: true}
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
                        id: "$_id"
                    },
                    qty: {$last: "$qty"},
                    dateName: {$last: "$dateName"},
                    description: {$last: "$description"},
                    productDoc: {$last: "$productDoc"},
                    locationDoc: {$last: "$locationDoc"},
                    productConvertDoc: {$push: "$$ROOT"}
                }
            },
            {
                $project: {
                    _id: "$_id.id",
                    qty: 1,
                    dateName: 1,
                    description: 1,
                    productDoc: 1,
                    locationDoc: 1,
                    productConvertDoc: 1,
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                }
            }
        ])

        if (convertInventoryList.length > 0) {
            let ind = 1;
            convertInventoryList[0].data.forEach((obj) => {
                let lnPro = obj.productConvertDoc.length;
                let inc = 1;
                if (obj.productConvertDoc.length > 0) {
                    obj.productConvertDoc.forEach((ob) => {
                        if (inc === 1) {
                            convertInventoryHTML += `
                        <tr>
                              <td style="text-align: center !important;vertical-align: inherit" rowspan="${lnPro}">${ind}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit;text-align: left !important;">${obj.dateName}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit;text-align: left !important;">${obj.productDoc.name}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit;text-align: center !important;">${obj.qty}</td>
                                 <td style="text-align: left !important;">${ob.productConvertDoc.name}</td>
                                 <td style="text-align: left">${ob.convert.qty}</td>
                                 <td rowspan="${lnPro}" style="vertical-align: inherit">${obj.description || ""}</td>
                        </tr>
                `;
                        } else {

                            convertInventoryHTML += `
                        <tr>
                             
                                 <td style="text-align: left !important;">${ob.productConvertDoc.name}</td>
                                 <td>${ob.convert.qty}</td>
                        </tr>
                `;
                        }
                        inc++;
                    })

                }

                ind++;

            })
        }


        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") +" - "+ moment(params.date[1]).format("DD/MM/YYYY");

        data.convertInventoryHTML = convertInventoryHTML;
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
