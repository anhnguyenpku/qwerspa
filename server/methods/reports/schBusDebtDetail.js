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
    schBusDebtDetailReport(params, translate) {
        let parameter = {};

        if (params.area !== "") {
            parameter.rolesArea = params.area;

        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});
        parameter.status = {$ne: "Close"};

        parameter.dueDate = {
            $lte: moment(params.date).endOf("day").toDate()
        };

        let busDebtDetailHTML = "";

        let busDebtDetailList = Sch_BusRegister.aggregate([
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
        if (busDebtDetailList[0] && busDebtDetailList[0].data.length > 0) {

            busDebtDetailList[0].data.forEach((obj) => {
                    if (obj) {

                        let month = moment(params.date).diff(obj.dueDate, "months");

                        busDebtDetailHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.phoneNumber}</td>
                            <td >${formatCurrency(obj.price * (month + 1))}</td>
                        </tr>
                    `;
                        i++;
                        let lDueDate = obj.dueDate;
                        while (lDueDate.getTime() <= params.date.getTime()) {
                            busDebtDetailHTML += `
                            <tr>
                                <td colspan="3" style="text-align: center !important;">${moment(lDueDate).format("DD/MM/YYYY")}</td>                                    
                                <td style="text-align: left !important;">${formatCurrency(obj.price)}</td>                                    
                            </tr>
                        `;
                            lDueDate = moment(lDueDate).add(1, "months").toDate();
                            total += obj.price;
                        }
                    }


                }
            );
            busDebtDetailHTML += `
                    <tr>
                        <th colspan="3">${translate['grandTotal']}</th>
                        <td>${formatCurrency(total)}</td>
                    </tr>
            `;
        }

        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.busDebtDetailHTML = busDebtDetailHTML;
        return data;
    }
});