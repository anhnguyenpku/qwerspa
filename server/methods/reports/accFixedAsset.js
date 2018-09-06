import {Meteor} from 'meteor/meteor';
import {Acc_Journal} from '../../../imports/collection/accJournal';
import {Acc_ChartAccount} from '../../../imports/collection/accChartAccount';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import numeral from 'numeral';
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {Acc_FixedAsset} from "../../../imports/collection/accFixedAsset";
import {Acc_Exchange} from "../../../imports/collection/accExchange";
import {GeneralFunction} from "../../../imports/api/methods/generalFunction";

Meteor.methods({
    fixedAssetReport(params) {
        this.unblock();
        let parameter = {};
        if (params.area != "") {
            parameter.rolesArea = params.area;
        }

        if (params.date != undefined) {
            parameter.buyDate = {
                $lte: moment(params.date).endOf("day").toDate()
            };
        }

        let fixedAssetHtml = "";

        let data = {};
        data.dateHeader = moment(params.date).format("DD/MM/YYYY");


        parameter.isDep = false;

        let fixedAssetList = Acc_FixedAsset.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: "acc_chartAccount",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountDoc"
                }
            },
            {
                $unwind: {path: "$accountDoc", preserveNullAndEmptyArrays: true}
            }
        ]);

        let companyDoc = WB_waterBillingSetup.findOne({});

        let accountShow = "";
        if (fixedAssetList.length > 0) {
            fixedAssetList.sort(compareASD);
            let i = 0;
            let totalAmount = 0;
            let totalCumDeprec = 0;
            let totalDepExp = 0;
            let totalNetBookValue = 0;


            let exchangeDoc = Acc_Exchange.findOne({_id: params.exchangeId});
            fixedAssetList.forEach(function (obj) {
                let cumDeprec = 0;
                let monthDep = 0;
                let depExp = 0;

                obj.transaction.forEach(function (ob) {
                    let depMonth = ob.maxMonth < companyDoc.depreciationPerTime ? ob.maxMonth : companyDoc.depreciationPerTime;
                    if (ob.month != 0) {
                        monthDep += ob.month;
                        cumDeprec += ob.month * ob.perMonth;
                        depExp = depMonth * ob.perMonth;
                    }
                })
                if (accountShow != obj.account && i > 1) {
                    fixedAssetHtml += `
                        <tr>
                        <td colspan='4' style='border-bottom: none' align='center'>Total</td>
                        <td>${formatCurrency(totalAmount, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
                        <td colspan='2'></td>
                        <td>${formatCurrency(totalDepExp, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
                        <td>${formatCurrency(totalCumDeprec, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
                        <td>${formatCurrency(totalNetBookValue, obj.currencyId) + getCurrencySymbolById(obj.currencyId)}</td>
                    `;

                }

                if (accountShow != obj.account) {
                    totalAmount = 0;
                    totalCumDeprec = 0;
                    totalDepExp = 0;
                    totalNetBookValue = 0;

                    i = 1;
                    fixedAssetHtml += `
                        <tr style='background-color: lightgrey'>
                         <td colspan='10' style='border-bottom: none; text-align: left !important;'>${obj.accountDoc.code} : ${obj.accountDoc.name}</td>
                        </tr>
                    `;

                }

                fixedAssetHtml += "<tr><td>" + i + "</td><td style='text-align: left !important;'>" + obj.code + "</td><td>" + (obj.description || "") + "</td><td>" + moment(obj.buyDate).format("DD-MM-YYYY") + "</td><td>" + formatCurrency(obj.value, obj.currencyId) + getCurrencySymbolById(obj.currencyId) + "</td><td>" + obj.life + "ឆ្នាំ (" + (obj.life * 12) + "ខែ)" + "</td><td>" + monthDep + "</td><td>" + formatCurrency(depExp, obj.currencyId) + getCurrencySymbolById(obj.currencyId) + "</td><td>" + formatCurrency(cumDeprec, obj.currencyId) + getCurrencySymbolById(obj.currencyId) + "</td><td>" + formatCurrency(obj.estSalvage, obj.currencyId) + getCurrencySymbolById(obj.currencyId) + "</td></tr>";
                accountShow = obj.account;
                i++;

                totalAmount += GeneralFunction.exchange(obj.currencyId, companyDoc.baseCurrency, obj.value, obj.rolesArea, exchangeDoc);
                totalCumDeprec += GeneralFunction.exchange(obj.currencyId, companyDoc.baseCurrency, cumDeprec, obj.rolesArea, exchangeDoc);
                totalDepExp += GeneralFunction.exchange(obj.currencyId, companyDoc.baseCurrency, depExp, obj.rolesArea, exchangeDoc);
                totalNetBookValue += GeneralFunction.exchange(obj.currencyId, companyDoc.baseCurrency, obj.estSalvage, obj.rolesArea, exchangeDoc);
            })
            fixedAssetHtml += "<tr><td colspan='4' style='border-bottom: none' align='center'>Total</td><td>" + formatCurrency(totalAmount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency) + "</td><td colspan='2'></td><td>" + formatCurrency(totalDepExp, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency) + "</td><td>" + formatCurrency(totalCumDeprec, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency) + "</td><td>" + formatCurrency(totalNetBookValue, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency) + "</td></tr>";
        }


        data.fixedAssetHtml = fixedAssetHtml;
        data.fixedAssetList = fixedAssetList;
        return data;
    }
});


let compareASD = function (a, b) {
    if (a.accountDoc.code < b.accountDoc.code) {
        return -1;
    } else if (a.accountDoc.code > b.accountDoc.code) {
        return 1;
    } else {
        return 0;
    }
}






