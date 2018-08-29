import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Acc_Journal} from '../../../imports/collection/accJournal';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    accPaymentPrintA4Report(paymentId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let jouranlList = Acc_Journal.aggregate([
            {$match: {_id: paymentId}},
            {
                $unwind: {
                    path: "$transaction",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'acc_chartAccount',
                    localField: 'transaction.account',
                    foreignField: '_id',
                    as: 'accountDoc'
                }
            }, {
                $unwind: {
                    path: "$accountDoc",
                    preserveNullAndEmptyArrays: true
                }
            }


        ]);

        let printPaymentA4Html = "";
        let ind = 1;
        let totalCash = 0;
        let totalBuy = 0;
        if (jouranlList.length > 0) {
            jouranlList[0].voucherId = jouranlList[0].voucherId && jouranlList[0].voucherId.length > 9 ? parseInt((jouranlList[0].voucherId && jouranlList[0].voucherId || "0000000000000").substr(9, 13)) : parseInt(jouranlList[0].voucherId && jouranlList[0].voucherId || "0");
            jouranlList[0].voucherId = pad(jouranlList[0].voucherId, 6);
            jouranlList.forEach((obj) => {
                if (obj.accountDoc && obj.accountDoc.accountTypeId === "15" || obj.accountDoc && obj.accountDoc.accountTypeId === "10") {
                    totalCash += obj.transaction.cr;
                } else {
                    totalBuy += obj.transaction.dr;
                    printPaymentA4Html += `
                    <tr>
                            <td style="border: 0px !important;">${ind}</td>
                            <td colspan="3" style="text-align: left !important;border: 0px !important;">${obj.accountDoc.name}</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.transaction.dr, jouranlList[0].currencyId)}</td>
                    </tr>
            
            `
                    ind++;
                }

            })

            printPaymentA4Html += `
                <tr>
                    <td colspan="4" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['total']} :</td>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalBuy, jouranlList[0].currencyId)} ${getCurrencySymbolById(jouranlList[0].currencyId)}</td>
                </tr>
    
                <tr>
                    <td style="border: 0px !important;text-align: center;padding-bottom: 0px !important;"></td>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['pleaseCheck']}</td>
                    <td style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalCash, jouranlList[0].currencyId)} ${getCurrencySymbolById(jouranlList[0].currencyId)}</td>
                </tr>
                <tr>
                    <td style="border: 0px !important;text-align: center;padding-bottom: 0px !important;"></td>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <td style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalCash - totalBuy, jouranlList[0].currencyId)} ${getCurrencySymbolById(jouranlList[0].currencyId)}</td>
                </tr>
                <tr>
                <td colspan="5" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber || ""}</td>
</tr>
            
            `
        }
        data.paymentDoc = jouranlList[0];
        data.printPaymentA4Html = printPaymentA4Html;
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
