import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posInvoiceReceivePaymentPrintA4Report(receivePaymentId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let invoiceList = Pos_ReceivePayment.aggregate([
            {$match: {_id: receivePaymentId}},
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
            invoiceList[0].invoice.forEach((obj) => {
                let invoiceNo = obj.invoiceNo && obj.invoiceNo.length > 9 ? parseInt((obj.invoiceNo && obj.invoiceNo || "0000000000000").substr(9, 13)) : parseInt(obj.invoiceNo && obj.invoiceNo || "0");
                invoiceNo = pad(invoiceNo, 6);
                printInvoiceA4Html += `
                    <tr>
                            <td style="border: 0px !important;">${ind}</td>
                            <td style="text-align: left !important;border: 0px !important;">${moment(obj.invoiceDate).format("DD/MM/YYYY")}</td>
                            <td style="text-align: left !important;border: 0px !important;">${invoiceNo}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.netAmount, companyDoc.baseCurrency)}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.paid, companyDoc.baseCurrency)}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.netAmount - obj.paid, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `
                ind++;
            })

            printInvoiceA4Html += `
                <tr>
                    <td colspan="4" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['total']} :</td>
                    <td colspan="2" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].totalAmount, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['discount']} :</td>
                    <td colspan="2" style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].totalDiscount, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['netTotal']} :</td>
                    <td colspan="2" style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].totalNetAmount, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['pleaseCheck']}</td>
                    <th colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</th>
                    <th colspan="2" style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].totalPaid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</td>
                    <td  colspan="2" style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(invoiceList[0].balanceUnPaid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                <td colspan="6" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber || ""}</td>
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
