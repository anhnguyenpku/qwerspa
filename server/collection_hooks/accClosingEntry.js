import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {Acc_ClosingEntry} from '../../imports/collection/accClosingEntry';
import {Acc_ChartAccountBalance} from '../../imports/collection/accChartAccountBalance';
import {Acc_Exchange} from '../../imports/collection/accExchange';
import {Acc_Journal} from "../../imports/collection/accJournal";
import {Acc_ChartAccount} from "../../imports/collection/accChartAccount";
import {WB_waterBillingSetup} from "../../imports/collection/waterBillingSetup";
import numeral from 'numeral';

import {formatCurrency} from "../../imports/api/methods/roundCurrency"
import {exchangeCoefficient} from "../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../imports/api/methods/roundCurrency"
import {Acc_FixedAsset} from "../../imports/collection/accFixedAsset";


Acc_ClosingEntry.before.insert(function (userId, doc) {
    try {
        let currMonth = moment(doc.closeDate).format("MM");
        let companyDoc = WB_waterBillingSetup.findOne({});
        let exchange = Acc_Exchange.findOne({_id: doc.exchangeId});

        let coefficientDrCr = exchangeCoefficient({
            exchange,
            fieldToCalculate: '$transaction.drcr',
            baseCurrency: companyDoc.baseCurrency
        });


        //Fixed Asset Expense=================================================

        let selectorFixedAsset = {};
        selectorFixedAsset.buyDate = {$lte: moment(doc.closeDate).add(-1, 'months').endOf('months').toDate()};
        selectorFixedAsset.isDep = false;
        selectorFixedAsset.rolesArea = doc.rolesArea;
        let depList = Acc_FixedAsset.find(selectorFixedAsset).fetch();
        let startYear = moment(doc.closeDate).year();
        let startDate = moment(startYear + '-' + '01-01').toDate();
        if (depList.length > 0) {
            let selectorExpenseList = [];
            Acc_FixedAsset.update({isDep: true}, {$inc: {increment: 1}}, {multi: true});

            depList.forEach(function (obj) {
                obj.transaction.sort(compareASD);
                //Insert into FixAssetExpense
                let selectorExpenseObj = {};
                selectorExpenseObj.fixedAssetid = obj._id;
                selectorExpenseObj.account = obj.account;
                selectorExpenseObj.buyDate = obj.buyDate;
                selectorExpenseObj.currencyId = obj.currencyId;

                for (let ob of obj.transaction) {
                    if (ob.status == false) {
                        let depTime = ob.maxMonth < companyDoc.depreciationPerTime ? ob.maxMonth : companyDoc.depreciationPerTime;
                        let depValue = formatCurrency(depTime * ob.perMonth, obj.currencyId);
                        selectorExpenseObj.value = numeral(depValue).value();
                        break;
                    }
                }
                selectorExpenseList.push(selectorExpenseObj);


                //Insert Into Journal
                let selectorJournal = {};
                selectorJournal.journalDate = doc.closeDate;
                selectorJournal.journalDateName = moment(doc.closeDate).format("DD/MM/YYYY");
                selectorJournal.currencyId = obj.currencyId;
                selectorJournal.memo = "Depreciation Expense " + moment(doc.closeDate).format("DD/MM/YYYY");


                selectorJournal.rolesArea = doc.rolesArea;
                selectorJournal.total = selectorExpenseObj.value;
                selectorJournal.closingEntryId = doc._id;
                selectorJournal.status = "Depreciation Expense";


                let accountFixedAssetDoc = Acc_ChartAccount.findOne({_id: obj.account});
                if (accountFixedAssetDoc) {
                    let transaction = [];
                    transaction.push({
                        account: accountFixedAssetDoc.mapFixedAsset.expenseId,
                        dr: selectorExpenseObj.value,
                        cr: 0,
                    }, {
                        account: accountFixedAssetDoc.mapFixedAsset.accumulatedId,
                        dr: 0,
                        cr: selectorExpenseObj.value,
                    });
                    selectorJournal.transaction = transaction;
                    Meteor.call("insertJournal", selectorJournal);


                    //Update FixedAsset

                    let transactionUpdate = [];
                    let i = 1;
                    let yearLength = obj.transaction.length;
                    obj.transaction.forEach(function (ob) {
                        if (i == 1 && ob.status == false) {
                            let depTime = ob.maxMonth < companyDoc.depreciationPerTime ? ob.maxMonth : companyDoc.depreciationPerTime;
                            ob.month += depTime;
                            i++;

                            if (ob.month == ob.maxMonth && yearLength == ob.year) {
                                obj.isDep = true;
                            }
                        }
                        if (ob.month == ob.maxMonth) {
                            ob.status = true;
                        }
                        transactionUpdate.push(ob);
                    })
                    obj.transaction = transactionUpdate;
                    Acc_FixedAsset.update({_id: obj._id}, {$set: obj});
                }
            })
            doc.transactionExpense = selectorExpenseList;
        }
        //End Fixed Asset expense=============================================


        // month is december must convert Net Income to Retain Earning==========================
        if (currMonth === "12") {
            let selectorNetIncome = {};
            selectorNetIncome.rolesArea = doc.rolesArea;

            selectorNetIncome.journalDate = {
                $lte: moment(doc.closeDate).endOf("day").toDate(),
                $gte: moment(doc.closeDate).startOf("year").toDate()
            };


            selectorNetIncome["accountDoc.accountTypeId"] = {$in: ["50", "51", "60", "61", "70"]};
            let netIncome = Acc_Journal.aggregate([
                {
                    $unwind: "$transaction"
                },

                {
                    $lookup:
                        {
                            from: "acc_chartAccount",
                            localField: "transaction.account",
                            foreignField: "_id",
                            as: "accountDoc"
                        }
                },
                {
                    $unwind: {
                        path: "$accountDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: selectorNetIncome
                },
                {
                    $project: {
                        drcr: {
                            $cond: {
                                if: {$eq: ['$currencyId', 'USD']},
                                then: coefficientDrCr.USD,
                                else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientDrCr.KHR, coefficientDrCr.THB]}
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        balance: {
                            $sum: "$drcr"
                        }
                    }
                }

            ]);

            let accountRetainEarning = Acc_ChartAccount.findOne({mapToAccount: "013"});
            let retainEarningDoc = {};
            retainEarningDoc.journalDate = moment("01/01/" + (parseInt(moment(doc.closeDate).format("YYYY")) + 1), "DD/MM/YYYY").toDate();
            retainEarningDoc.journalDateName = "01/01/" + (parseInt(moment(doc.closeDate).format("YYYY")) + 1);
            retainEarningDoc.currencyId = companyDoc.baseCurrency;
            retainEarningDoc.voucherId = doc.rolesArea + (parseInt(moment(doc.closeDate).format("YYYY")) + 1) + "000001";
            retainEarningDoc.memo = "Net Income to Retain Earning";
            retainEarningDoc.rolesArea = doc.rolesArea;
            retainEarningDoc.total = Math.abs(netIncome[0] && numeral(formatCurrency(netIncome[0].balance, companyDoc.baseCurrency)).value() || 0);
            retainEarningDoc.closingEntryId = doc._id;
            retainEarningDoc.status = "End Of Year";

            let totalRet = netIncome[0] && numeral(numeral(netIncome[0].balance).format("0,00.000")).value() || 0;
            let transaction = [];
            transaction.push({
                account: accountRetainEarning._id,
                dr: totalRet > 0 ? totalRet : 0,
                cr: totalRet > 0 ? 0 : -totalRet,
                drcr: totalRet
            });
            retainEarningDoc.transaction = transaction;
            Acc_Journal.insert(retainEarningDoc);
        }
        //End Month 12==========================================================================
        //Currency Closing

        let exchangeGainDoc = Acc_ChartAccount.findOne({mapToAccount: "001"});
        let exchangeLossDoc = Acc_ChartAccount.findOne({mapToAccount: "002"});
        let equivalentDoc = Acc_ChartAccount.findOne({mapToAccount: "003"});
        let foreignExDoc = Acc_ChartAccount.findOne({mapToAccount: "004"});


        if (companyDoc.baseCurrency != "KHR") {
            let currencyClosingArr = getCurrencyClosing("KHR", doc.rolesArea, doc.closeDate, exchange, companyDoc.baseCurrency);
            if (currencyClosingArr && currencyClosingArr.length > 0) {
                currencyClosing(doc, currencyClosingArr, equivalentDoc, foreignExDoc, companyDoc, "KHR");
            }
        } else if (companyDoc.baseCurrency != "USD") {
            let currencyClosingArr = getCurrencyClosing("USD", doc.rolesArea, doc.closeDate, exchange, companyDoc.baseCurrency);
            if (currencyClosingArr && currencyClosingArr.length > 0) {
                currencyClosing(doc, currencyClosingArr, equivalentDoc, foreignExDoc, companyDoc, "USD");
            }
        } else if (companyDoc.baseCurrency != "THB") {
            let currencyClosingArr = getCurrencyClosing("THB", doc.rolesArea, doc.closeDate, exchange, companyDoc.baseCurrency);
            if (currencyClosingArr && currencyClosingArr.length > 0) {
                currencyClosing(doc, currencyClosingArr, equivalentDoc, foreignExDoc, companyDoc, "THB");
            }
        }


        //Gain Loss Exchange
        let selectorClosingEntry = {};
        selectorClosingEntry.rolesArea = doc.rolesArea;
        selectorClosingEntry.closeDate = {$lt: moment(doc.closeDate).startOf("day").toDate()};

        let closingEntry = Acc_ClosingEntry.findOne(selectorClosingEntry, {sort: {closeDate: -1}});

        let foreignResult = getLastBalanceByAccount(companyDoc.baseCurrency, foreignExDoc._id, exchange, closingEntry, doc.rolesArea, doc.closeDate);
        let equResult = getLastBalanceByAccount(companyDoc.baseCurrency, equivalentDoc._id, exchange, closingEntry, doc.rolesArea, doc.closeDate);

        let balanceExchange = numeral(numeral(equResult - foreignResult).format("0,00.000")).value();
        let exchangeDoc = {};


        exchangeDoc.journalDate = doc.closeDate;
        exchangeDoc.journalDateName = moment(doc.closeDate).format("DD/MM/YYYY");
        exchangeDoc.currencyId = companyDoc.baseCurrency;
        exchangeDoc.rolesArea = doc.rolesArea;
        exchangeDoc.total = Math.abs(balanceExchange);
        exchangeDoc.closingEntryId = doc._id;
        exchangeDoc.status = "Gain Loss Exchange";
        let transactionExchange = [];
        if (balanceExchange > 0) {
            exchangeDoc.memo = "Exchange Gain";

            transactionExchange.push({
                account: foreignExDoc._id,
                dr: balanceExchange,
                cr: 0,
                drcr: balanceExchange
            }, {
                account: exchangeGainDoc._id,
                dr: 0,
                cr: balanceExchange,
                drcr: -balanceExchange
            });

            exchangeDoc.transaction = transactionExchange;

            Meteor.call("autoIncreseVoucher", doc.rolesArea, doc.closeDate, companyDoc.baseCurrency, function (err, result) {
                if (!err) {
                    exchangeDoc.voucherId = doc.rolesArea + moment(doc.closeDate).format("YYYY") + pad(parseFloat(result || 0) + 1, 6);
                    Acc_Journal.insert(exchangeDoc);

                } else {
                    console.log(err.message());
                }
            })

        } else if (balanceExchange < 0) {
            exchangeDoc.memo = "Exchange Loss";

            transactionExchange.push({
                account: exchangeLossDoc._id,
                dr: -balanceExchange,
                cr: 0,
                drcr: -balanceExchange
            }, {
                account: foreignExDoc._id,
                dr: 0,
                cr: -balanceExchange,
                drcr: balanceExchange
            });

            exchangeDoc.transaction = transactionExchange;
            Meteor.call("autoIncreseVoucher", doc.rolesArea, doc.closeDate, companyDoc.baseCurrency, function (err, result) {
                if (!err) {
                    exchangeDoc.voucherId = doc.rolesArea + moment(doc.closeDate).format("YYYY") + pad(parseFloat(result || 0) + 1, 6);
                    Acc_Journal.insert(exchangeDoc);

                } else {
                    console.log(err.message());
                }
            })
        }

    } catch (err) {
        if (err) {
            console.log(err);
        }
        Acc_Journal.remove({closingEntryId: doc._id});
    }
});

Acc_ClosingEntry.after.insert(function (userId, doc) {
    try {
        //Close Chart Account
        let currMonth = moment(doc.closeDate).format("MM");

        let companyDoc = WB_waterBillingSetup.findOne({});
        let exchange = Acc_Exchange.findOne({_id: doc.exchangeId});

        let coefficientDrCr = exchangeCoefficient({
            exchange,
            fieldToCalculate: '$transaction.drcr',
            baseCurrency: companyDoc.baseCurrency
        });

        let selectorGetLastDate = {};
        let rolesArea = doc.rolesArea;
        selectorGetLastDate.rolesArea = rolesArea;
        selectorGetLastDate.closeDate = {$lt: moment(doc.closeDate).startOf("days").toDate()};
        let lastDate = Acc_ClosingEntry.findOne(
            selectorGetLastDate, {
                sort: {
                    closeDate: -1
                }
            });


        if (lastDate != undefined) {
            if (lastDate.closeDate < doc.closeDate) {

                let selectorGetLastBalance = {};
                let selector = {};
                let selectorChartAccount = {};
                //Parameter for Balance Last End Of Process
                if (lastDate != undefined) {
                    selectorGetLastBalance.month = lastDate.month;
                    selectorGetLastBalance.year = lastDate.year;
                }
                selectorGetLastBalance.rolesArea = rolesArea;
                //Parameter End Process
                if (currMonth == "12") {
                    selectorChartAccount['accountDoc.accountTypeId'] = {
                        $gte: "01",
                        $lte: "49"
                    };
                }
                selector.rolesArea = rolesArea;
                if (lastDate != undefined) {
                    selector.journalDate = {
                        $gte: moment(lastDate.closeDate).startOf("days").add(1, 'days').toDate(),
                        $lt: moment(doc.closeDate).startOf("days").add(1, 'days').toDate()
                    }
                } else {
                    selector.journalDate = {
                        $lt: moment(moment(doc.closeDate).format("DD/MM/YYYY"), "DD/MM/YYYY").add(1, 'days').toDate()
                    }
                }
                Meteor.call('insertChartAccountBalance', selector, rolesArea,
                    selectorGetLastBalance, lastDate, doc.closeDate, doc._id, selectorChartAccount, function (err, result) {
                        if (err) {
                            console.log(err.message);
                        }
                    });

            }
        } else {

            let rolesArea = doc.rolesArea;
            let selectorGetLastBalance = {};
            let selector = {};
            let selectorChartAccount = {};

            //Parameter for Balance Last End Of Process
            if (lastDate != undefined) {
                selectorGetLastBalance.year = lastDate.year;
                selectorGetLastBalance.month = lastDate.month;
            }
            selectorGetLastBalance.rolesArea = rolesArea;

            //Parameter End Process
            if (currMonth == "12") {
                selectorChartAccount['accountDoc.accountTypeId'] = {
                    $gte: "01",
                    $lte: "49"
                };
            }

            selector.rolesArea = rolesArea;
            if (lastDate != undefined) {
                selector.journalDate = {
                    $gte: moment(lastDate.closeDate).startOf("days").add(1, 'days').toDate(),
                    $lt: moment(doc.closeDate).startOf("days").add(1, 'days').toDate()
                }
            } else {
                selector.journalDate = {
                    $lt: moment(doc.closeDate).startOf("days").add(1, 'days').toDate()
                }
            }
            Meteor.call('insertChartAccountBalance', selector, rolesArea,
                selectorGetLastBalance, lastDate, doc.closeDate, doc._id, selectorChartAccount, function (err, result) {
                    if (err) {
                        console.log(err.message);
                    }
                });
        }
    } catch (err) {
        if (err) {
            console.log(err);
        }
        Acc_Journal.remove({closingEntryId: doc._id});
        Acc_ChartAccountBalance.remove({closingEntryId: doc._id});
    }
});

Acc_ClosingEntry.after.remove(function (userId, doc) {


    let companyDoc = WB_waterBillingSetup.findOne();
    Acc_FixedAsset.update({isDep: true}, {$inc: {increment: -1}}, {multi: true});
    let depList = Acc_FixedAsset.find({increment: 0}).fetch();

    if (depList.length > 0) {
        depList.forEach(function (obj) {
            //Update DepExpList
            let transactionUpdate = [];
            let i = 1;

            obj.transaction.sort(compare);
            obj.transaction.forEach(function (ob) {
                if (i == 1 && ob.month > 0) {
                    ob.month -= companyDoc.depreciationPerTime;
                    ob.month = ob.month > 0 ? ob.month : 0;
                    i++;

                    if (ob.month < ob.maxMonth) {
                        obj.isDep = false;
                    }
                }
                if (ob.month < ob.maxMonth) {
                    ob.status = false;
                }
                transactionUpdate.push(ob);
            })
            transactionUpdate.sort(compareASD);
            obj.transaction = transactionUpdate;
            Acc_FixedAsset.update({_id: obj._id}, {$set: obj});
        })
    }

    Acc_Journal.remove({closingEntryId: doc._id});
    Acc_ChartAccountBalance.remove({closingEntryId: doc._id});
});


let getCurrencyClosing = function (currencyId, roleArea, date, exchange, baseCurrency) {
    let selector = {};
    let selectorChartAccount = {};
    let coefficientDrCr = exchangeCoefficient({
        exchange,
        fieldToCalculate: '$transaction.drcr',
        baseCurrency: baseCurrency
    });


    selector.rolesArea = roleArea;
    selector.currencyId = currencyId;
    selector.journalDate = {
        $lte: moment(date).endOf("day").toDate(),
        $gte: moment(date).startOf("month").toDate()
    };


    selectorChartAccount["accountDoc.accountTypeId"] = {$in: ["50", "51", "60", "61", "70"]};

    let journalList = Acc_Journal.aggregate([
        {
            $match: selector
        },
        {
            $project: {
                _id: 1,
                currencyId: 1,
                journalDate: 1,
                total: 1,
                voucherId: 1,
                memo: 1,
                transaction: 1,
                copyTransaction: "$transaction"
            }
        },
        {
            $unwind: {
                path: "$transaction",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
                {
                    from: "acc_chartAccount",
                    localField: "transaction.account",
                    foreignField: "_id",
                    as: "accountDoc"
                }
        },
        {
            $unwind: {
                path: "$accountDoc",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: selectorChartAccount
        }
        ,
        {
            $project: {
                id: "$_id",
                currencyId: "$currencyId",
                journalDate: "$journalDate",
                total: "$total",
                voucherId: "$voucherId",
                memo: "$memo",
                transaction: "$transaction",
                copyTransaction: "$copyTransaction",
                accountDoc: "$accountDoc",
                drcrBase: "$transaction.drcr",
                drcr: {
                    $cond: {
                        if: {$eq: ['$currencyId', 'USD']},
                        then: coefficientDrCr.USD,
                        else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientDrCr.KHR, coefficientDrCr.THB]}
                    }
                }
            }
        }, {
            $project: {
                id: 1,
                currencyId: 1,
                journalDate: 1,
                total: 1,
                voucherId: 1,
                memo: 1,
                transaction: 1,
                copyTransaction: 1,
                accountDoc: 1,
                drcr: {$cond: [{$in: ["$accountDoc.accountTypeId", ["30", "32", "34", "36", "40", "41", "50", "51"]]}, {$multiply: ["$drcr", -1]}, "$drcr"]},
                drcrBase: {$cond: [{$in: ["$accountDoc.accountTypeId", ["30", "32", "34", "36", "40", "41", "50", "51"]]}, {$multiply: ["$drcrBase", -1]}, "$drcrBase"]}
            }
        },
        {$sort: {"accountDoc.code": -1}},
        {
            $group: {
                _id: {
                    accountDoc: "$accountDoc"
                },
                // data: {$addToSet: "$$ROOT"},
                total: {$sum: "$drcr"},
                totalBase: {$sum: "$drcrBase"}
            }
        }
    ])
    return journalList;
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}


let currencyClosing = function (doc, currencyClosingArr, equivalentDoc, foreignExDoc, companyDoc, currency) {
    let currencyClosingDoc = {};
    let currencyClosingDocBase = {};


    let transaction = [];
    let transactionBase = [];
    let total = 0;
    let totalBase = 0;
    currencyClosingArr.forEach(function (obj) {
        //Currency Select
        let numberTotal = numeral(numeral(obj.totalBase).format("0,00.000")).value();

        //Base Currency
        let numberTotalBase = numeral(numeral(obj.total).format("0,00.000")).value();

        if (["50", "51"].indexOf(obj._id.accountDoc.accountTypeId) > -1) {
            transaction.push({
                account: obj._id.accountDoc._id,
                dr: numberTotal > 0 ? numberTotal : 0,
                cr: numberTotal > 0 ? 0 : -numberTotal,
                drcr: numberTotal
            });

            transactionBase.push({
                account: obj._id.accountDoc._id,
                dr: numberTotalBase > 0 ? 0 : -numberTotalBase,
                cr: numberTotalBase > 0 ? numberTotalBase : 0,
                drcr: -numberTotalBase
            });

            total -= numberTotal;
            totalBase -= numberTotalBase;
        } else {
            transaction.push({
                account: obj._id.accountDoc._id,
                dr: numberTotal > 0 ? 0 : -numberTotal,
                cr: numberTotal > 0 ? numberTotal : 0,
                drcr: -numberTotal
            });

            transactionBase.push({
                account: obj._id.accountDoc._id,
                dr: numberTotalBase > 0 ? numberTotalBase : 0,
                cr: numberTotalBase > 0 ? 0 : -numberTotalBase,
                drcr: numberTotalBase
            });


            total += numberTotal;
            totalBase += numberTotalBase;
        }
    })

    transaction.unshift({
        account: foreignExDoc._id,
        dr: total > 0 ? numeral(numeral(total).format("0,00.000")).value() : 0,
        cr: total > 0 ? 0 : -numeral(numeral(total).format("0,00.000")).value(),
        drcr: numeral(numeral(total).format("0,00.000")).value()
    })

    transactionBase.push({
        account: equivalentDoc._id,
        dr: totalBase > 0 ? 0 : -numeral(numeral(totalBase).format("0,00.000")).value(),
        cr: totalBase > 0 ? numeral(numeral(totalBase).format("0,00.000")).value() : 0,
        drcr: -numeral(numeral(totalBase).format("0,00.000")).value()
    })


    //Closing Currency Select


    currencyClosingDoc.journalDate = doc.closeDate;
    currencyClosingDoc.journalDateName = moment(doc.closeDate).format("DD/MM/YYYY");
    currencyClosingDoc.rolesArea = doc.rolesArea;
    currencyClosingDoc.closingEntryId = doc._id;
    currencyClosingDoc.status = "End Of Month";
    currencyClosingDoc.currencyId = currency;
    currencyClosingDoc.memo = "Closing " + currency;
    currencyClosingDoc.total = Math.abs(numeral(numeral(total).format("0,00.000")).value());
    currencyClosingDoc.transaction = transaction;
    currencyClosingDoc.isCurrencyClosing = true;

    Meteor.call("autoIncreseVoucher", doc.rolesArea, doc.closeDate, currency, function (err, result) {
        if (!err) {
            currencyClosingDoc.voucherId = doc.rolesArea + moment(doc.closeDate).format("YYYY") + pad(parseFloat(result || 0) + 1, 6);
            Acc_Journal.insert(currencyClosingDoc);
        } else {
            console.log(err.message);
        }
    })

    //Opening To Base Currency
    currencyClosingDocBase.journalDate = doc.closeDate;
    currencyClosingDocBase.journalDateName = moment(doc.closeDate).format("DD/MM/YYYY");
    currencyClosingDocBase.rolesArea = doc.rolesArea;
    currencyClosingDocBase.closingEntryId = doc._id;
    currencyClosingDocBase.status = "End Of Month";
    currencyClosingDocBase.currencyId = companyDoc.baseCurrency;
    currencyClosingDocBase.memo = "Opening " + companyDoc.baseCurrency;
    currencyClosingDocBase.total = Math.abs(numeral(numeral(totalBase).format("0,00.000")).value());
    currencyClosingDocBase.transaction = transactionBase;
    currencyClosingDocBase.isCurrencyClosing = true;


    Meteor.call("autoIncreseVoucher", doc.rolesArea, doc.closeDate, companyDoc.baseCurrency, function (err, result) {
        if (!err) {
            currencyClosingDocBase.voucherId = doc.rolesArea + moment(doc.closeDate).format("YYYY") + pad(parseFloat(result || 0) + 1, 6);
            Acc_Journal.insert(currencyClosingDocBase);
        } else {
            console.log(err.message());
        }
    })
}


let getLastBalanceByAccount = function (baseCurrency, accountId, exchange, closingEntry, rolesArea, endDate) {
    let coefficientValue = exchangeCoefficient({
        exchange,
        fieldToCalculate: '$value',
        baseCurrency: baseCurrency
    });


    let coefficientDrCr = exchangeCoefficient({
        exchange,
        fieldToCalculate: '$transaction.drcr',
        baseCurrency: baseCurrency
    });

    let selectorChartAccountBalance = {};
    let selectorChartAccount = {};
    let parameter = {};

    selectorChartAccountBalance.rolesArea = rolesArea;

    let chartAccountBalance;
    if (closingEntry) {
        selectorChartAccountBalance.month = closingEntry.month;
        selectorChartAccountBalance.year = closingEntry.year;
        selectorChartAccountBalance.chartAccountId = accountId;
        chartAccountBalance = Acc_ChartAccountBalance.aggregate([
            {$match: selectorChartAccountBalance},
            {
                $lookup:
                    {
                        from: "acc_chartAccount",
                        localField: "chartAccountId",
                        foreignField: "_id",
                        as: "accountDoc"
                    }
            },
            {
                $unwind: {
                    path: "$accountDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    chartAccountId: 1,
                    accountDoc: 1,
                    value: {
                        $cond: {
                            if: {$eq: ['$currencyId', 'USD']},
                            then: coefficientValue.USD,
                            else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientValue.KHR, coefficientValue.THB]}
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        chartAccountId: "$chartAccountId",
                        accountDoc: "$accountDoc"
                    },
                    value: {$sum: "$value"}
                }
            },
            {
                $project: {
                    _id: 0,
                    chartAccountId: "$_id.chartAccountId",
                    value: {$cond: [{$in: ["$_id.accountDoc.accountTypeId", ["30", "32", "34", "36", "40", "41", "50", "51"]]}, {$multiply: ["$value", -1]}, "$value"]}
                }
            }

        ]);


        if (endDate != undefined) {

            parameter.journalDate = {
                $lte: moment(endDate).endOf("day").toDate(),
                $gte: moment(closingEntry.closeDate).startOf("day").add(1, "day").toDate()
            };
        }
    } else {
        if (endDate != undefined) {
            parameter.journalDate = {
                $lte: moment(endDate).endOf("day").toDate()
            };
        }
    }

    parameter.rolesArea = rolesArea;
    selectorChartAccount["transaction.account"] = accountId;
    //Range Date
    let journalList = Acc_Journal.aggregate([
        {
            $match: parameter
        },
        {
            $unwind: {
                path: "$transaction",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: selectorChartAccount
        },
        {
            $lookup:
                {
                    from: "acc_chartAccount",
                    localField: "transaction.account",
                    foreignField: "_id",
                    as: "accountDoc"
                }
        },
        {
            $unwind: {
                path: "$accountDoc",
                preserveNullAndEmptyArrays: true
            }
        }
        ,
        {
            $project: {
                id: "$_id",
                currencyId: "$currencyId",
                journalDate: "$journalDate",
                total: "$total",
                voucherId: "$voucherId",
                memo: "$memo",
                transaction: "$transaction",
                accountDoc: "$accountDoc",
                drcr: {
                    $cond: {
                        if: {$eq: ['$currencyId', 'USD']},
                        then: coefficientDrCr.USD,
                        else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientDrCr.KHR, coefficientDrCr.THB]}
                    }
                }
            }
        }, {
            $project: {
                id: 1,
                currencyId: 1,
                journalDate: 1,
                total: 1,
                voucherId: 1,
                memo: 1,
                transaction: 1,
                accountDoc: 1,
                drcr: {$cond: [{$in: ["$accountDoc.accountTypeId", ["30", "32", "34", "36", "40", "41", "50", "51"]]}, {$multiply: ["$drcr", -1]}, "$drcr"]}
            }
        },
        {$sort: {"accountDoc.code": -1}},
        {
            $group: {
                _id: {
                    accountDoc: "$accountDoc"
                },
                data: {$addToSet: "$$ROOT"},
                total: {$sum: "$drcr"},
            }
        }
    ])

    let total = 0;

    if (journalList && journalList.length > 0) {
        total += numeral(numeral(journalList[0].total).format("0,00.000")).value();
    }

    if (chartAccountBalance && chartAccountBalance.length > 0) {
        total += numeral(numeral(chartAccountBalance[0].value).format("0,00.000")).value();
    }
    return total;

}

function compare(a, b) {
    if (a.year < b.year) {
        return 1;
    } else if (a.year > b.year) {
        return -1;
    } else {
        return 0;
    }
}

function compareASD(a, b) {
    if (a.year < b.year) {
        return -1;
    } else if (a.year > b.year) {
        return 1;
    } else {
        return 0;
    }
}