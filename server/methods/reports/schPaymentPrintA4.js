import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Payment} from '../../../imports/collection/schPayment';
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
    schPaymentPrintA4Report(paymentId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let paymentList = Sch_Payment.aggregate([
            {$match: {_id: paymentId}},
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
            },
            {
                $lookup: {
                    from: 'sch_class',
                    localField: 'classId',
                    foreignField: '_id',
                    as: 'classDoc'
                }
            }, {
                $unwind: {
                    path: "$classDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        let printPaymentA4Html = "";
        let ind = 1;
        if (paymentList.length > 0) {
            paymentList[0].paymentNo = paymentList[0].paymentNo && paymentList[0].paymentNo.length > 9 ? parseInt((paymentList[0].paymentNo && paymentList[0].paymentNo || "0000000000000").substr(9, 13)) : parseInt(paymentList[0].paymentNo && paymentList[0].paymentNo || "0");
            paymentList[0].paymentNo = pad(paymentList[0].paymentNo, 6);

            let classTable = Sch_ClassTable.aggregate([
                {$match: {classId: paymentList[0].classId}},
                {
                    $unwind: {
                        path: "$studentList",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "studentList.studentId": paymentList[0].studentId
                    }
                }
            ]);
            let totalPaid = 0;
            let totalNetAmount = 0;
            if (paymentList[0].schedule.length > 0) {
                paymentList[0].schedule.forEach((obj) => {
                    if (obj.isPaid === true) {
                        printPaymentA4Html += `
                    <tr>
                            <td style="border: 0px !important;">${obj.receivePaymentScheduleDateName}</td>
                            <td style="border: 0px !important;">${moment(moment(obj.receivePaymentScheduleDate).add(classTable[0].studentList.term || 0, "months").toDate()).format("DD/MM/YYYY")}</td>
                            <td style="text-align: left !important;border: 0px !important;">Tuition Fee</td>
                            <td style="border: 0px !important;">${formatCurrency(obj.netAmount, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `;
                        totalNetAmount += obj.netAmount;
                        totalPaid += obj.paid;
                        ind++;
                    }
                });
            } else {
                printPaymentA4Html += `
                    <tr>
                            <td style="text-align: left !important;border: 0px !important;" colspan="3">Tuition Fee Free</td>
                            <td style="border: 0px !important;">${formatCurrency(0, companyDoc.baseCurrency)}</td>
                    </tr>
            
            `;
            }

            printPaymentA4Html += `
                <tr>
                    <td colspan="3" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['netTotal']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].totalNetAmount, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['fee']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].fee, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['penalty']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].penalty, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['waived']} :</td>
                    <td style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].totalWaived, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['pleaseCheck']}</td>
                    <th colspan="1" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['paid']} :</th>
                    <th style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].totalPaid, companyDoc.baseCurrency)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 0px !important;text-align: center;padding-bottom: 0px !important;">${translate['thankYou']}</td>
                    <th colspan="1" style="border: 0px !important;text-align: right;padding-bottom: 0px !important;">${translate['totalDue']} :</th>
                    <th style="border: 0px !important;padding-bottom: 0px !important;text-align: right !important;">${formatCurrency(paymentList[0].balanceUnPaid)} ${getCurrencySymbolById(companyDoc.baseCurrency)}</th>
                </tr>
                <tr>
                <td colspan="4" style="border: 0px !important; text-align: center !important;font-size: 10px !important;">${translate['forQuestion']} ${companyDoc && companyDoc.phoneNumber}</td>
</tr>
            
            `
        }
        data.paymentDoc = paymentList[0];
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
