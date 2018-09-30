import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_SaleOrder} from '../../../imports/collection/posSaleOrder';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posSaleOrderPrintA4Report(saleOrderId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let saleOrderList = Pos_SaleOrder.aggregate([
            {$match: {_id: saleOrderId}},
            {
                $lookup: {
                    from: 'pos_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            }, {
                $unwind: {
                    path: "$customerDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        let printSaleOrderA4Html = "";
        let ind = 1;
        if (saleOrderList.length > 0) {
            saleOrderList[0].saleOrderNo = saleOrderList[0].saleOrderNo && saleOrderList[0].saleOrderNo.length > 9 ? parseInt((saleOrderList[0].saleOrderNo && saleOrderList[0].saleOrderNo || "0000000000000").substr(9, 13)) : parseInt(saleOrderList[0].saleOrderNo && saleOrderList[0].saleOrderNo || "0");
            saleOrderList[0].saleOrderNo = pad(saleOrderList[0].saleOrderNo, 6);
            saleOrderList[0].item.forEach((obj) => {
                printSaleOrderA4Html += `
                    <tr>
                            <td style="border: 0px !important;">${ind}</td>
                            <td style="text-align: left !important;border: 0px !important;">${obj.itemName}</td>
                            <td style="border: 0px !important;">${obj.totalUnit}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.price, companyDoc.baseCurrency)}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.amount, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
            })

            let returnAmount = "";

            let remainAmount = "";
            if (companyDoc.baseCurrency === "KHR") {
                if (saleOrderList[0].remainKHR < 0) {
                    returnAmount = translate['returnKHR'];
                    remainAmount = formatCurrency(Math.abs(saleOrderList[0].remainKHR), "KHR") + getCurrencySymbolById("KHR");
                }
            } else if (companyDoc.baseCurrency === "USD") {
                if (saleOrderList[0].remainKHR < 0) {
                    returnAmount = translate['returnUSD'];
                    remainAmount = formatCurrency(Math.abs(saleOrderList[0].remainUSD), "USD") + getCurrencySymbolById("USD");
                }
            } else if (companyDoc.baseCurrency === "THB") {
                if (saleOrderList[0].remainKHR < 0) {
                    returnAmount = translate['returnTHB'];
                    remainAmount = formatCurrency(Math.abs(saleOrderList[0].remainTHB), "THB") + getCurrencySymbolById("THB");
                }
            }
            printSaleOrderA4Html += `
                <tr>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${returnAmount}</td>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;text-align: left !important;">${remainAmount}</td>
                    <td colspan="2" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['total']} :</td>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(saleOrderList[0].total, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                `;

            if (saleOrderList[0].discountValue > 0) {
                printSaleOrderA4Html += `
                <tr>  
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['discount']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(saleOrderList[0].discountValue, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['netTotal']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(saleOrderList[0].netTotal, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>`;
            }


            if (saleOrderList[0].paidUSD > 0) {
                printSaleOrderA4Html += `
                  <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paidUSD']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: left !important;">${formatCurrency(saleOrderList[0].paidUSD, "USD")} ${getCurrencySymbolById("USD")}</td>
                </tr>
                `;
            }
            if (saleOrderList[0].paidTHB > 0) {
                printSaleOrderA4Html += `
                  <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paidTHB']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: left !important;">${formatCurrency(saleOrderList[0].paidTHB, "THB")} ${getCurrencySymbolById("THB")}</td>
                </tr>
                `;
            }

            if (saleOrderList[0].paidKHR > 0) {
                printSaleOrderA4Html += `
                  <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paidKHR']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: left !important;">${formatCurrency(saleOrderList[0].paidKHR, "KHR")} ${getCurrencySymbolById("KHR")}</td>
                </tr>
                `;
            }

            let noteLabel = "";
            let note = "";
            if (saleOrderList[0].note && saleOrderList[0].note !== "") {
                noteLabel = translate['note'] + " : ";
                note = saleOrderList[0].note;
            } else {
                note = translate["pleaseCheck"];
            }


            printSaleOrderA4Html += `
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${noteLabel} ${note}</td>
                    <th colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</th>
                    <th style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(saleOrderList[0].paid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(saleOrderList[0].netTotal - saleOrderList[0].paid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                <td colspan="5" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber || ""}</td>
</tr>   
            `
        }
        data.saleOrderDoc = saleOrderList[0];
        data.printSaleOrderA4Html = printSaleOrderA4Html;
        return data;
    }
});

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}
