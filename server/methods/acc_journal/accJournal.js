import {Acc_Journal} from '../../../imports/collection/accJournal';

import {SpaceChar} from "../../../both/config.js/space"
import {Acc_ChartAccount} from "../../../imports/collection/accChartAccount";
import numeral from 'numeral';


import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency";
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";
import {roundCurrency} from "../../../imports/api/methods/roundCurrency";


Meteor.methods({
    queryJournal({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countJournal: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [
                        {name: {$regex: reg, $options: 'mi'}},
                        {currencyId: {$regex: reg, $options: 'mi'}},
                        {memo: {$regex: reg, $options: 'mi'}},
                        {journalDateName: {$regex: reg, $options: 'mi'}},
                        {status: {$regex: reg, $options: 'mi'}},
                        {total: {$regex: reg, $options: 'mi'}},
                        {voucherId: {$regex: reg, $options: 'mi'}}];
                }
            }
            let journals = Acc_Journal.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {
                        journalDate: -1
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (journals.length > 0) {
                data.content = journals;
                let journalTotal = Acc_Journal.find(selector).count();
                data.countJournal = journalTotal;
            }
            return data;
        }
    },
    queryJournalById(id) {
        return Acc_Journal.findOne({_id: id});
    },
    queryJournalByIdShow(id) {
        let data = Acc_Journal.findOne({_id: id});
        data.transaction.map(function (obj) {
            obj.accountDoc = Acc_ChartAccount.findOne({_id: obj.account});
            obj.dr = formatCurrency(obj.dr, data.currencyId)
            obj.cr = formatCurrency(obj.cr, data.currencyId)
            obj.drcr = formatCurrency(obj.drcr, data.currencyId)
            return obj;
        })
        return data;
    },
    insertJournal(data) {

        if (data.voucherId) {
            data.voucherId = data.rolesArea + moment(data.journalData).format("YYYY") + pad(data.voucherId, 6);
        } else {
            Meteor.call("autoIncreseVoucher", data.rolesArea, data.journalDate, data.currencyId, function (err, result) {
                data.voucherId = result;
            })
        }
        data.transaction.map(function (obj) {
            return obj.drcr = parseFloat(obj.dr) - parseFloat(obj.cr);
        })

        return Acc_Journal.insert(data);
    },
    insertJournalPaid(data, type) {
        data.voucherId = data.rolesArea + moment(data.journalData).format("YYYY") + pad(data.voucherId, 6);
        let totalMethod = 0;
        let newTransaction = [];
        if (type == "Receive") {
            data.transaction.map(function (obj) {
                totalMethod += parseFloat(obj.amount);
                newTransaction.push({
                    account: obj.account,
                    dr: 0,
                    cr: parseFloat(obj.amount),
                    drcr: -parseFloat(obj.amount)
                })
            })

            newTransaction.unshift({
                account: data.method,
                dr: totalMethod,
                cr: 0,
                drcr: totalMethod

            })
        } else {
            data.transaction.map(function (obj) {
                totalMethod += parseFloat(obj.amount);
                newTransaction.push({
                    account: obj.account,
                    dr: parseFloat(obj.amount),
                    cr: 0,
                    drcr: parseFloat(obj.amount)
                })
            })


            newTransaction.push({
                account: data.method,
                dr: 0,
                cr: totalMethod,
                drcr: -totalMethod
            })
        }
        data.transaction = newTransaction;
        return Acc_Journal.insert(data);
    },
    updateJournal(data, id) {

        data.voucherId = data.rolesArea + moment(data.journalDate).format("YYYY") + pad(data.voucherId, 6);
        data.transaction.map(function (obj) {
            return obj.drcr = parseFloat(obj.dr) - parseFloat(obj.cr);
        })

        return Acc_Journal.update({_id: id},
            {
                $set: data
            });
    },
    removeJournal(id) {
        return Acc_Journal.remove({_id: id});
    },
    autoIncreseVoucher(roleArea, journalDate, currencyId) {
        let startYear = moment(journalDate).startOf("year").toDate();
        let endYear = moment(journalDate).endOf("year").toDate();
        let journalDoc = Acc_Journal.findOne({
            rolesArea: roleArea,
            journalDate: {$gte: startYear, $lte: endYear},
            currencyId: currencyId
        }, {sort: {journalDate: -1, voucherId: -1}});
        if (journalDoc == undefined) {
            return 0;
        }
        return journalDoc.voucherId.substr(8, 20);
    }
});


function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}