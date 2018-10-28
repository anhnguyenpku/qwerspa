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

Meteor.methods({
    posInvoiceByImeiReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});
        let reg = new RegExp(params.imei);
        parameter['item.desc'] = {$regex: reg, $options: 'mi'}


        //Range Date
        let salelObj = Pos_Invoice.findOne(parameter);

        data.currencyHeader = companyDoc.baseCurrency;
        let saleHTML = "";
        let ind = 1;
        let totalAm = 0;
        if (salelObj) {
            salelObj.item.forEach((obj) => {
                saleHTML += `
                    <tr>
                            <td style="text-align: center !important;">${ind}</td>
                            <td style="text-align: left !important;">${obj.itemName}</td>
                            <td style="text-align: left !important;">${obj.desc || ""}</td>
                            <td style="text-align: left !important;">${obj.qty}</td>
                            <td style="text-align: left !important;">${obj.price}</td>
                            <td>${formatCurrency(obj.amount, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
                totalAm += obj.amount;
            })
            saleHTML += `
            <tr>
                <th colspan="3" style="text-align: left !important;">${translate['note']} : ${salelObj.note || ""}</th>
                <th colspan="2">${translate['grandTotal']}</th>
                 <td>${formatCurrency(totalAm, companyDoc.baseCurrency)}</td>
            </tr>
`
            data.buyDate = salelObj.invoiceDateName;
            data.invoiceId = salelObj.invoiceNo;

        }
        data.saleHTML = saleHTML;
        return data;
    }
})
;

