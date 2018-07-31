import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_PaymentSchedule} from '../../../imports/collection/schPaymentSchedule';
import {Sch_Class} from '../../../imports/collection/schClass';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schDebtSummaryReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.classId != "") {
            parameter.classId = params.classId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});
        parameter.status = {$ne: "Complete"};

        parameter.receivePaymentScheduleDate = {
            $lte: moment(params.date).endOf("day").toDate()
        };

        let debtSummaryHTML = "";

        let debtSummaryList = Sch_PaymentSchedule.aggregate([
            {$match: parameter},
            {
                $group: {
                    _id: {
                        studentId: "$studentId",
                        classId: "$classId"

                    },
                    totalNetAmount: {$sum: "$netAmount"},
                    totalPaid: {$sum: "$paid"},
                    totalDiscount: {$sum: "$discount"},
                }
            },
            {
                $lookup: {
                    from: 'sch_class',
                    localField: '_id.classId',
                    foreignField: '_id',
                    as: 'classDoc'
                }
            },
            {
                $unwind: {
                    path: "$classDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_student',
                    localField: '_id.studentId',
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
                    totalNetAmount: {$sum: "$totalNetAmount"},
                    totalPaid: {$sum: "$totalPaid"},
                    totalDiscount: {$sum: "$totalDiscount"}
                }
            },
        ]);


        let i = 1;
        if (debtSummaryList[0] && debtSummaryList[0].data.length > 0) {
            debtSummaryList[0].data.forEach((obj) => {
                if (obj) {
                    debtSummaryHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.phoneNumber}</td>
                            <td style="text-align: center !important;">${obj.classDoc && obj.classDoc.name || ""}</td>
                            <td >${formatCurrency(obj.totalNetAmount - obj.totalPaid - obj.totalDiscount)}</td>
                        </tr>
                    `;
                    i++;
                }
            });
            debtSummaryHTML += `
                    <tr>
                        <th colspan="4">${translate['grandTotal']}</th>
                        <td>${formatCurrency(debtSummaryList[0].totalNetAmount - debtSummaryList[0].totalPaid - debtSummaryList[0].totalDiscount)}</td>
                    </tr>
            `;
        }

        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.debtSummaryHTML = debtSummaryHTML;
        return data;
    }
});