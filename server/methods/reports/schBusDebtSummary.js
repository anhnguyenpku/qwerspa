import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_BusRegister} from '../../../imports/collection/schBusRegister';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {Sch_ClassTable} from "../../../imports/collection/schClassTable";

Meteor.methods({
    schBusDebtSummaryReport(params, translate) {
        let parameter = {};

        if (params.area !== "") {
            parameter.rolesArea = params.area;

        }
        if (params.classId !== "") {
            parameter.classId = params.classId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});
        parameter.status = {$ne: "Close"};

        parameter.dueDate = {
            $lte: moment(params.date).endOf("day").toDate()
        };

        let busDebtSummaryHTML = "";

        let busDebtSummaryList = Sch_BusRegister.aggregate([
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
                    totalAmount: {$sum: "$price"}
                }
            },
        ]);


        let i = 1;
        let total = 0;
        if (busDebtSummaryList[0] && busDebtSummaryList[0].data.length > 0) {
            busDebtSummaryList[0].data.forEach((obj) => {
                if (obj) {
                    let month = moment(params.date).diff(obj.dueDate, "months");
                    busDebtSummaryHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.phoneNumber}</td>
                            <td style="text-align: left !important;">${moment(obj.dueDate).format("DD/MM/YYYY")}</td>
                            <td >${formatCurrency(obj.price * (month + 1))}</td>
                        </tr>
                    `;
                    i++;
                    total += (obj.price * (month + 1))

                }
            });
            busDebtSummaryHTML += `
                    <tr>
                        <th colspan="4">${translate['grandTotal']}</th>
                        <td>${formatCurrency(total)}</td>
                    </tr>
            `;
        }

        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.busDebtSummaryHTML = busDebtSummaryHTML;
        return data;
    }
});