import {Meteor} from 'meteor/meteor';
import {Acc_Journal} from '../../../imports/collection/accJournal';
import {Acc_ChartAccount} from '../../../imports/collection/accChartAccount';
import {Acc_Exchange} from '../../../imports/collection/accExchange';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Acc_ChartAccountBalance} from '../../../imports/collection/accChartAccountBalance';
import {Acc_ClosingEntry} from '../../../imports/collection/accClosingEntry';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    trialBalanceReport(params) {
        let parameter = {};
        let selectorClosingEntry = {};
        let selectorChartAccountBalance = {};


        if (params.area != "") {
            parameter.rolesArea = params.area;
            selectorClosingEntry.rolesArea = params.area;
            selectorChartAccountBalance.rolesArea = params.area;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});

        data.currencyHeader = companyDoc.baseCurrency;
        let baseCurrency = companyDoc.baseCurrency;
        if (params.currency != "") {
            parameter.currencyId = params.currency;
            selectorChartAccountBalance.currencyId = params.currency;

            baseCurrency = params.currency;
            data.currencyHeader = params.currency;
        }
        if (params.date != undefined) {
            parameter.journalDate = {
                $lte: moment(params.date).endOf("day").toDate(),
                $gte: moment(params.date).startOf("day").toDate()
            };

            selectorClosingEntry.closeDate = {$lt: moment(params.date).startOf("day").toDate()}
        }
        let closingEntry = Acc_ClosingEntry.findOne(selectorClosingEntry, {sort: {closeDate: -1}});

        if (closingEntry) {
            if (params.date != undefined) {
                parameter.journalDate = {
                    $lte: moment(params.date).endOf("day").toDate(),
                    $gte: moment(closingEntry.closeDate).add(1, "day").startOf("day").toDate()
                };
            }
        } else {
            if (params.date != undefined) {
                parameter.journalDate = {
                    $lte: moment(params.date).endOf("day").toDate()
                };
            }
        }


        let exchange = Acc_Exchange.findOne({_id: params.exchangeId});


        let coefficientDrCr = exchangeCoefficient({
            exchange,
            fieldToCalculate: '$transaction.drcr',
            baseCurrency: baseCurrency
        });
        let coefficientValue = exchangeCoefficient({
            exchange,
            fieldToCalculate: '$value',
            baseCurrency: baseCurrency
        });

        //Range Date
        let journalList = Acc_Journal.aggregate([

            {
                $match: parameter
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
                    drcr: {
                        $cond: {
                            if: {$eq: ['$currencyId', 'USD']},
                            then: coefficientDrCr.USD,
                            else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientDrCr.KHR, coefficientDrCr.THB]}
                        }
                    },
                    dr: {
                        $cond: {
                            if: {$eq: ['$currencyId', 'USD']},
                            then: coefficientDrCr.USD,
                            else: {$cond: [{$eq: ['$currencyId', 'KHR']}, coefficientDrCr.KHR, coefficientDrCr.THB]}
                        }
                    },
                    cr: {
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
                }
            },
            {$sort: {"accountDoc.code": -1}},
            {
                $group: {
                    _id: {
                        accountDoc: "$accountDoc"
                    },
                    data: {$addToSet: "$$ROOT"},
                    total: {$sum: "$drcr"}
                }
            }
        ])

        //Closing Entry Date

        let chartAccountBalance = [];
        if (closingEntry) {
            selectorChartAccountBalance.month = closingEntry.month;
            selectorChartAccountBalance.year = closingEntry.year;


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
                        accountTypeId: "$_id.accountDoc.accountTypeId",
                        value: {$cond: [{$in: ["$_id.accountDoc.accountTypeId", ["30", "32", "34", "36", "40", "41", "50", "51"]]}, {$multiply: ["$value", -1]}, "$value"]}
                    }
                }

            ]);
        }

        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        let trialBalanceHTML = "";

        let chartAccountParentList = Acc_ChartAccount.aggregate([

            {
                $graphLookup: {
                    from: "acc_chartAccount",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "subAccountOf",
                    maxDepth: 3,
                    depthField: "numConnections",
                    as: "childList"
                }
            }, {
                $sort: {code: 1}
            }
        ])


        let chartAccountList = Acc_ChartAccount.aggregate([
            {
                $graphLookup: {
                    from: "acc_chartAccount",
                    startWith: "$subAccountOf",
                    connectFromField: "subAccountOf",
                    connectToField: "_id",
                    maxDepth: 3,
                    depthField: "numConnections",
                    as: "parentDoc"
                }
            }, {
                $sort: {code: 1}
            }
        ]);
        let j = 1;
        let totalDr = 0;
        let totalCr = 0;
        chartAccountList.forEach(function (chartAccDoc) {
            trialBalanceHTML += `<th>${j}</th><th style="text-align: left !important;">${SpaceChar.space(chartAccDoc.level * 6) + chartAccDoc.code} : ${chartAccDoc.name}</th>
                         
            `;
            j++;
            let findJournalDocByChartAccountId = function (element) {
                if (element._id.accountDoc._id == chartAccDoc._id) {
                    return element;
                }
            }
            let journalDoc = journalList.find(findJournalDocByChartAccountId);
            let balance = 0;
            let totalParent = 0;
            let totalAccount = 0;

            let beginingBalClose = chartAccountBalance.find((o) => o.chartAccountId == chartAccDoc._id);
            if (beginingBalClose) {
                totalAccount += beginingBalClose.value;
                totalParent += beginingBalClose.value;


            }

            if (journalDoc) {
                totalAccount += journalDoc.total;
                totalParent += journalDoc.total;

                if (["30", "32", "34", "36", "40", "41", "50", "51"].indexOf(chartAccDoc.accountTypeId) > -1) {
                    trialBalanceHTML += `
                        <th>${totalAccount > 0 ? "" : formatCurrency(Math.abs(totalAccount), data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15)}</th>
                        <th>${totalAccount > 0 ? formatCurrency(totalAccount, data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15) : "" }</th>

                    </tr>
                `;
                    if (chartAccDoc.level == 0) {
                        totalDr += totalParent > 0 ? 0 : Math.abs(totalParent);
                        totalCr += totalParent > 0 ? totalParent : 0;
                    }
                } else {
                    trialBalanceHTML += `
                        <th>${totalAccount > 0 ? formatCurrency(totalAccount, data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15) : "" }</th>
                        <th>${totalAccount > 0 ? "" : formatCurrency(Math.abs(totalAccount), data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15)}</th>
                    </tr>
                `;
                    if (chartAccDoc.level == 0) {
                        totalCr += totalParent > 0 ? 0 : Math.abs(totalParent);
                        totalDr += totalParent > 0 ? totalParent : 0;
                    }
                }


            } else {
                let childListDoc = chartAccountParentList.find((o) => o._id == chartAccDoc._id);

                if (childListDoc && childListDoc.childList.length > 0) {
                    let childListDocElement = childListDoc.childList.map(function (obj) {
                        return obj._id;
                    })

                    //Rank
                    let findJournalDocByParentId = function (element) {
                        if (childListDocElement.indexOf(element._id.accountDoc._id) > -1) {
                            totalParent += element.total;
                        }
                    }

                    journalList.find(findJournalDocByParentId);

                    //Closing Entry

                    let findJournalDocClosingEntryByParentId = function (element) {
                        if (childListDocElement.indexOf(element.chartAccountId) > -1) {
                            totalParent += element.value;
                        }
                    }
                    chartAccountBalance.find(findJournalDocClosingEntryByParentId);

                }

                if (["30", "32", "34", "36", "40", "41", "50", "51"].indexOf(chartAccDoc.accountTypeId) > -1) {
                    trialBalanceHTML += `
                        <th>${totalParent > 0 ? "" : formatCurrency(Math.abs(totalParent), data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15)}</th>
                        <th>${totalParent > 0 ? formatCurrency(totalParent, data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15) : "" }</th>

                    </tr>                    
                `;
                    if (chartAccDoc.level == 0) {
                        totalDr += totalParent > 0 ? 0 : Math.abs(totalParent);
                        totalCr += totalParent > 0 ? totalParent : 0;
                    }

                } else {
                    trialBalanceHTML += `
                        <th>${totalParent > 0 ? formatCurrency(totalParent, data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15) : "" }</th>
                        <th>${totalParent > 0 ? "" : formatCurrency(Math.abs(totalParent), data.currencyHeader) + SpaceChar.space(chartAccDoc.level * 15)}</th>
                    </tr>
                `;
                    if (chartAccDoc.level == 0) {
                        totalCr += totalParent > 0 ? 0 : Math.abs(totalParent);
                        totalDr += totalParent > 0 ? totalParent : 0;
                    }

                }
            }

        })

        trialBalanceHTML += `
                <tr>
                    <th colspan="2">Total : </th>
                    <th>${formatCurrency(totalDr, data.currencyHeader) }</th>
                    <th>${formatCurrency(totalCr, data.currencyHeader) }</th>
                </tr>
                
        `;


        data.trialBalanceHTML = trialBalanceHTML;

        return data;
    }
});
