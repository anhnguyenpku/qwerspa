import {Meteor} from 'meteor/meteor';
import {Acc_Journal} from '../../../imports/collection/accJournal';
import {Acc_ChartAccount} from '../../../imports/collection/accChartAccount';
import {Acc_Exchange} from '../../../imports/collection/accExchange';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Acc_ChartAccountBalance} from '../../../imports/collection/accChartAccountBalance';
import {Acc_ClosingEntry} from '../../../imports/collection/accClosingEntry';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';

Meteor.methods({
    accountListReport(params) {

        let data = {};
        let accountListHTML = "";

        let chartAccountList = Acc_ChartAccount.aggregate([
            {
                $lookup: {
                    from: "acc_accountType",
                    localField: "accountTypeId",
                    foreignField: "_id",
                    as: "accountTypeDoc"
                }
            },
            {
                $unwind: {path: "$accountTypeDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "acc_chartAccount",
                    localField: "subAccountOf",
                    foreignField: "_id",
                    as: "subAccountOfDoc"
                }
            },
            {
                $unwind: {path: "$subAccountOfDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    code: 1,
                    subAccountOf: 1,
                    accountTypeId: 1,
                    accountTypeName: "$accountTypeDoc.name",
                    level: 1,
                    description: 1,
                    isPaidTax: 1,
                    subAccountOfName: {$concat: ["$subAccountOfDoc.code", " : ", "$subAccountOfDoc.name"]}
                }
            }
        ]);

        let i = 1;
        chartAccountList.forEach(function (chartAccDoc) {
            let tax = "";
            if (chartAccDoc.isPaidTax) {
                tax = `<span class="label label-success">${chartAccDoc.isPaidTax}</span>`;
            } else {
                tax = `<span class="label label-warning">${chartAccDoc.isPaidTax}</span>`;

            }
            accountListHTML += `
                <tr>
                    <td>${i}</td>
                    <td style="text-align: left !important;">${SpaceChar.space(chartAccDoc.level * 6) + chartAccDoc.code} : ${chartAccDoc.name}</td>
                    <td style="text-align: left !important;">${chartAccDoc.accountTypeName}</td>
                    <td>${chartAccDoc.level}</td>
                    <td style="text-align: left !important;">${chartAccDoc.subAccountOfName || ""}</td>
                    <td>${tax}</td>
                    <td style="text-align: left !important;">${chartAccDoc.description || ""}</td>
                </tr>     
            `;
            i++;

        })


        data.accountListHTML = accountListHTML;
        return data;
    }
});




