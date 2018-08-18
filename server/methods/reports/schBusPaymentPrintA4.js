import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_BusPayment} from '../../../imports/collection/schBusPayment';
import {Sch_Student} from '../../../imports/collection/schStudent';
import {Sch_Class} from '../../../imports/collection/schClass';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {Sch_ClassTable} from "../../../imports/collection/schClassTable";

Meteor.methods({
    schBusPaymentPrintA4Report(busPaymentId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let busPaymentList = Sch_BusPayment.aggregate([
            {$match: {_id: busPaymentId}},
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            }, {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        let printBusPaymentA4Html = "";
        let ind = 1;
        if (busPaymentList.length > 0) {
            busPaymentList[0].busPaymentNo = busPaymentList[0].busPaymentNo && busPaymentList[0].busPaymentNo.length > 9 ? parseInt((busPaymentList[0].busPaymentNo && busPaymentList[0].busPaymentNo || "0000000000000").substr(9, 13)) : parseInt(busPaymentList[0].busPaymentNo && busPaymentList[0].busPaymentNo || "0");
            busPaymentList[0].busPaymentNo = pad(busPaymentList[0].busPaymentNo, 6);
            let totalPaid = 0;
            let totalAmount = 0;
            let totalWaived = 0;
            busPaymentList[0].schedule.forEach((obj) => {
                if (obj.isPaid === true) {
                    printBusPaymentA4Html += `
                    <tr>
                            <td style="border: 0px !important;">${moment(obj.dueDate).format("DD/MM/YYYY")}</td>
                            <td style="text-align: left !important;border: 0px !important;">Bus Fee</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.amount, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `;
                    totalAmount += obj.amount;
                    totalPaid += obj.paid;
                    totalWaived += obj.waived;
                    ind++;
                }
            });

            printBusPaymentA4Html += `
                <tr>
                    <td colspan="2" style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['total']} :</td>
                    <td style="border-left: 0px !important;border-bottom: 0px !important;border-right: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalAmount, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['waived']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalWaived, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['netTotal']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalAmount - totalWaived, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="1" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['pleaseCheck']}</td>
                    <th colspan="1" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</th>
                    <th style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalPaid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                    <td colspan="1" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <th colspan="1" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</th>
                    <th style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(totalAmount - totalWaived - totalPaid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                <td colspan="4" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber}</td>
</tr>
            
            `
        }
        data.busPaymentDoc = busPaymentList[0];
        data.printBusPaymentA4Html = printBusPaymentA4Html;
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
