import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Payment} from '../../../imports/collection/schPayment';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schPaymentReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.classId != "") {
            parameter.classId = params.classId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.paymentDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };

        let paymentHTML = "";

        if (params.groupBy === "None") {
            let paymentList = Sch_Payment.aggregate([
                {$match: parameter},
                {
                    $lookup: {
                        from: 'sch_class',
                        localField: 'classId',
                        foreignField: '_id',
                        as: 'classDoc'
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$classDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'sch_student',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'studentDoc'
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$studentDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {$push: "$$ROOT"},
                        totalPaid: {$sum: "$totalPaid"},
                        balanceUnPaid: {$sum: "$balanceUnPaid"}
                    }
                },
            ]);


            let i = 1;
            if (paymentList[0] && paymentList[0].data.length > 0) {
                paymentList[0].data.forEach((obj) => {
                    if (obj) {
                        paymentHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.paymentDateName}</td>
                            <td style="text-align: center !important;">${obj.classDoc.name}</td>
                            <td >${formatCurrency(obj.totalNetAmount + obj.totalDiscount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalDiscount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalNetAmount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalPaid, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.balanceUnPaid, companyDoc.baseCurrency)}</td>
                        </tr>
                    `;
                        i++;
                    }
                });
                paymentHTML += `
                    <tr>
                        <th colspan="7">${translate['grandTotal']}</th>
                        <td>${formatCurrency(paymentList[0].totalPaid, companyDoc.baseCurrency)}</td>
                        <td>${formatCurrency(paymentList[0].balanceUnPaid, companyDoc.baseCurrency)}</td>
                    </tr>
            `;
            }
        } else {
            let paymentList = Sch_Payment.aggregate([
                {$match: parameter},
                {
                    $lookup: {
                        from: 'sch_class',
                        localField: 'classId',
                        foreignField: '_id',
                        as: 'classDoc'
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$classDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: 'sch_student',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'studentDoc'
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$studentDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            teacherId: "$classDoc.teacherId",
                            classId: "$classDoc._id",
                            chargeType: "$classDoc.chargeType",
                            charge: "$classDoc.charge",
                        },
                        data: {$push: "$$ROOT"},
                        totalPaid: {$sum: "$totalPaid"},
                        balanceUnPaid: {$sum: "$balanceUnPaid"}
                    }
                },
                {
                    $lookup: {
                        from: 'sch_teacher',
                        localField: '_id.teacherId',
                        foreignField: '_id',
                        as: 'teacherDoc'
                    }
                }
                ,
                {
                    $unwind: {
                        path: "$teacherDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);


            let i = 1;
            let grandTotalCharge = 0;
            if (paymentList && paymentList.length > 0) {
                paymentList.forEach((rawObj) => {
                    let bodyTeacherPaymentHTML = "";
                    let totalCharge = 0;
                    if (paymentList) {
                        rawObj.data.forEach((obj) => {
                            let rateCharge = (rawObj._id.charge * obj.totalPaid) / 100;
                            bodyTeacherPaymentHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.paymentDateName}</td>
                            <td style="text-align: center !important;">${obj.classDoc.name}</td>
                            <td >${formatCurrency(obj.totalNetAmount + obj.totalDiscount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalDiscount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalNetAmount, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalPaid, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.balanceUnPaid, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(rateCharge, companyDoc.baseCurrency)}</td>
                        </tr>
                    `;
                            totalCharge += rateCharge;
                            i++;
                        });
                        paymentHTML += `
                            <tr>
                                <td colspan="9" style="text-align: left !important;">${rawObj.teacherDoc.personal.name} (${rawObj.teacherDoc.personal.phoneNumber})</td>
                                <td >${formatCurrency(totalCharge, companyDoc.baseCurrency)}</td>
                            </tr>
                        `;
                        paymentHTML += bodyTeacherPaymentHTML;
                        grandTotalCharge += totalCharge;

                    }
                });
                paymentHTML += `
                    <tr>
                        <th colspan="7">${translate['grandTotal']}</th>
                        <td>${formatCurrency(paymentList[0].totalPaid, companyDoc.baseCurrency)}</td>
                        <td>${formatCurrency(paymentList[0].balanceUnPaid, companyDoc.baseCurrency)}</td>
                        <td>${formatCurrency(grandTotalCharge, companyDoc.baseCurrency)}</td>
                    </tr>
            `;
            }
        }
        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.paymentHTML = paymentHTML;
        return data;
    }
})
;


function getVoucherSubString(invoiceNo) {
    let newInvoice = invoiceNo.length > 9 ? parseInt((invoiceNo || "0000000000000").substr(9, 13)) : parseInt(invoiceNo || "0");
    return pad(newInvoice, 6);
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function getTypePromotion(val) {
    if (val === "Percent") {
        return "%";
    }
    return "";
}
