import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Acc_FixedAsset} from '../../../imports/collection/accFixedAsset';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {Acc_ChartAccount} from "../../../imports/collection/accChartAccount";

Meteor.methods({
    accFixedAssetScheduleReport(fixedAssetId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        //Range Date
        let fixedAssetDoc = Acc_FixedAsset.findOne({_id: fixedAssetId});
        let accountDoc = Acc_ChartAccount.findOne({_id: fixedAssetDoc.account})

        let fixedAssetScheduleHtml = "";
        if (fixedAssetDoc) {
            if (fixedAssetDoc.transaction.length > 0) {
                let cumDeprec = 0;
                let bvEndYear = fixedAssetDoc.value;
                fixedAssetScheduleHtml += `
                    <tr>
                        <td colspan="6">${accountDoc.code} : ${accountDoc.name}  = ${fixedAssetDoc.value} ${getCurrencySymbolById(fixedAssetDoc.currencyId)}</td>
                    </tr>
                `;

                fixedAssetDoc.transaction.forEach((obj) => {


                    cumDeprec += obj.perYear;
                    bvEndYear -= obj.perYear;
                    fixedAssetScheduleHtml += `
                        <tr>
                            <td>${obj.year}</td>
                            <td>${formatCurrency(obj.perMonth, fixedAssetDoc.currencyId)}</td>
                            <td>${formatCurrency(obj.perYear, fixedAssetDoc.currencyId)}</td>
                            <td>${formatCurrency(cumDeprec, fixedAssetDoc.currencyId)}</td>
                            <td>${formatCurrency(bvEndYear, fixedAssetDoc.currencyId)}</td>
                            <td>${obj.month}</td>
                        </tr>
                    `;
                })
            }
        }
        data.fixedAssetScheduleHtml = fixedAssetScheduleHtml;
        data.fixedAssetDoc = fixedAssetDoc;
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
