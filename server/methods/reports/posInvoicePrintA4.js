import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posInvoicePrintA4Report(invoiceId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let invoiceList = Pos_Invoice.aggregate([
            {$match: {_id: invoiceId}},
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

        let printInvoiceA4Html = "";
        let ind = 1;
        if (invoiceList.length > 0) {
            invoiceList[0].invoiceNo = invoiceList[0].invoiceNo && invoiceList[0].invoiceNo.length > 9 ? parseInt((invoiceList[0].invoiceNo && invoiceList[0].invoiceNo || "0000000000000").substr(9, 13)) : parseInt(invoiceList[0].invoiceNo && invoiceList[0].invoiceNo || "0");
            invoiceList[0].invoiceNo = pad(invoiceList[0].invoiceNo, 6);
            invoiceList[0].item.forEach((obj) => {
                printInvoiceA4Html += `
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

            printInvoiceA4Html += `
                <tr>
                    <td colspan="4" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['total']} :</td>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].total, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['discount']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].discountValue, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['netTotal']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].netTotal, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['pleaseCheck']}</td>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].paid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].netTotal - invoiceList[0].paid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                <td colspan="5" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber}</td>
</tr>
            
            `
        }
        data.invoiceDoc = invoiceList[0];
        data.printInvoiceA4Html = printInvoiceA4Html;
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
