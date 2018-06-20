import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_Product} from '../../../imports/collection/posProduct';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

let JsBarcode = require('jsbarcode');
let Canvas = require("canvas");
let canvas = new Canvas();

Meteor.methods({
    posProductListReport() {
        let parameter = {};


        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let productList = Pos_Product.aggregate([
            {
                $sort: {
                    name: 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                }
            }
        ]);
        let productListHTML = "";
        if (productList.length > 0) {
            let ind = 1;
            productList[0].data.forEach((obj) => {
                productListHTML += `
                    <tr>
                            <td style="text-align: center !important;">${ind}</td>
                            <td style="text-align: left !important;">${obj.code} : ${obj.name}</td>
                            <td>${obj.productType}</td>
                            <td>${obj.description || ""}</td>
                            <td>${formatCurrency(obj.rePrice)}</td>
                            <td>${formatCurrency(obj.cost)}</td>
                            <td>${obj.qtyOnHand}</td>
                            <td>${JsBarcode(canvas, "Hello")};
                    </td>
                    </tr>
            
            `;
                ind++;
            })

        }
        data.productListHTML = productListHTML;
        return data;
    }
})
;

