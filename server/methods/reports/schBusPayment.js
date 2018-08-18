import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_BusPayment} from '../../../imports/collection/schBusPayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schBusPaymentReport(params, translate) {
        let parameter = {};

        if (params.area !== "") {
            parameter.rolesArea = params.area;

        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.busPaymentDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };

        let busPaymentHTML = "";

        let busPaymentList = Sch_BusPayment.aggregate([
            {$match: parameter},
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
                    totalAmount: {$sum: "$totalAmount"},
                    totalPaid: {$sum: "$totalPaid"},
                    totalWaived: {$sum: "$totalWaived"},
                    totalPenalty: {$sum: "$penalty"},
                    balanceUnPaid: {$sum: "$balanceUnPaid"}
                }
            },
        ]);


        let i = 1;
        if (busPaymentList[0] && busPaymentList[0].data.length > 0) {
            busPaymentList[0].data.forEach((obj) => {
                if (obj) {
                    busPaymentHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.busPaymentDateName}</td>
                            <td >${formatCurrency(obj.totalAmount, companyDoc.baseCurrency)}</td>    
                            <td >${formatCurrency(obj.totalWaived, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.penalty, companyDoc.baseCurrency)}</td>
                            <td >${formatCurrency(obj.totalPaid, companyDoc.baseCurrency)}</td>
                        </tr>
                    `;
                    i++;
                }
            });
            busPaymentHTML += `
                    <tr>
                        <th colspan="3">${translate['grandTotal']}</th>
                        <td>${formatCurrency(busPaymentList[0].totalAmount, companyDoc.baseCurrency)}</td>
                        <td>${formatCurrency(busPaymentList[0].totalWaived, companyDoc.baseCurrency)}</td>  
                        <td>${formatCurrency(busPaymentList[0].totalPenalty, companyDoc.baseCurrency)}</td>
                        <td>${formatCurrency(busPaymentList[0].totalPaid, companyDoc.baseCurrency)}</td>
                    </tr>
            `;
        }
        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.busPaymentHTML = busPaymentHTML;
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
