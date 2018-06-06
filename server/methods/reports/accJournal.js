import {Meteor} from 'meteor/meteor';
import {Acc_Journal} from '../../../imports/collection/accJournal';
import {Acc_ChartAccount} from '../../../imports/collection/accChartAccount';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import numeral from 'numeral';
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    journalReport(params) {
        this.unblock();
        let parameter = {};
        if (params.area != "") {
            parameter.rolesArea = params.area;
        }

        if (params.currency != "") {
            parameter.currencyId = params.currency;
        }

        if (params.date != undefined) {
            parameter.journalDate = {
                $gte: moment(params.date[0]).startOf("day").toDate(),
                $lte: moment(params.date[1]).endOf("day").toDate()
            };
        }

        let chartAccountList = Acc_ChartAccount.find().fetch();
        let journalHTML = "";

        let i = 1;
        let data = {};
        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " To " + moment(params.date[1]).format("DD/MM/YYYY");
        let journalList = Acc_Journal.find(parameter).fetch();
        journalList.map(function (obj) {
            let accountName = "";
            let dr = "";
            let cr = "";
            let transactionLength = 1;
            if (obj.transaction.length > 1) {
                transactionLength = obj.transaction.length + 1;
            } else {
                transactionLength++;
            }

            journalHTML += `<tr>
                                <td rowspan="${transactionLength}"​ style="vertical-align: middle; text-align: center !important;">${i}</td>
                                <td rowspan="${transactionLength}"​ style="vertical-align: middle; text-align: center !important;">${obj.journalDateName}</td>
                                <td rowspan="${transactionLength}"​ style="vertical-align: middle; text-align: left !important;">${obj.voucherId}</td>
                                <td rowspan="${transactionLength}"​ style="vertical-align: middle; text-align: left !important;">${obj.currencyId}</td>
                                <td rowspan="${transactionLength}"​ style="vertical-align: middle; text-align: left !important;">${obj.memo}</td>
                         
                            `;
            let j = 1;
            obj.transaction.forEach(function (ob) {
                let findChartAccountById = function (element) {
                    if (element._id == ob.account) {
                        return element;
                    }
                }

                let chartAccountDoc = chartAccountList.find(findChartAccountById);
                accountName = chartAccountDoc.code + " : " + chartAccountDoc.name;
                dr = formatCurrency(ob.dr, obj.currencyId);
                cr = formatCurrency(ob.cr, obj.currencyId);
                if (j == 1) {
                    journalHTML += `<td style="text-align: left !important;">${accountName}</td>
                                  <td>${dr}</td>
                                  <td>${cr}</td>
                               </tr>
                                   
                    `;

                } else {
                    journalHTML += `<tr>
                                        <td style="text-align: left !important;">${accountName}</td>
                                        <td>${dr}</td>
                                        <td>${cr}</td>
                                  </tr>
                       
                    `;
                }
                j++;
            })
            journalHTML += `<tr>
                        <td><b>Total:</b></td>
                        <td>${formatCurrency(obj.total, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
                        <td>${formatCurrency(obj.total, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
            </tr>`;
            i++;
        });
        data.journalHTML = journalHTML;
        data.journalList = journalList;
        return data;
    }
});








