import {WB_Payment} from '../../../imports/collection/payment';


Meteor.methods({
    fetchTellerPaymentSummary(selector, selector2) {
        let data = {
            content: [],
            footer: {}
        };
        let payments = WB_Payment.aggregate([
            {
                $match: selector
            },
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDetailDoc'
                },

            }, {
                $unwind: {
                    path: '$meterReadingJournalDetailDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: selector2
            },

            {
                $group: {
                    _id: {
                        type: '$type',
                        blockId: '$meterReadingJournalDetailDoc.block',
                        userId: '$createdBy',
                        month: {$month: "$meterReadingJournalDetailDoc.newReadingDate"},
                        year: {$year: "$meterReadingJournalDetailDoc.newReadingDate"}
                    },
                    blockId: {
                        $last: '$meterReadingJournalDetailDoc.block'
                    },
                    waterConsumption: {
                        $sum: '$meterReadingJournalDetailDoc.waterConsumption'
                    },
                    dueAmount: {
                        $sum: '$dueAmount'
                    },
                    paidAmount: {
                        $sum: '$paidAmount'
                    },
                    saving: {
                        $sum: '$withdrawing'
                    },
                    contributionFee: {
                        $sum: '$meterReadingJournalDetailDoc.contributionFee'
                    },
                    maintenanceFee: {
                        $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
                    },
                    balance: {
                        $sum: '$balance'
                    },
                    grandTotal: {
                        $sum: '$meterReadingJournalDetailDoc.grandTotal'
                    },
                    total: {
                        $sum: '$meterReadingJournalDetailDoc.total'
                    },
                    numberOfInvoice: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'blockId',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'blockDoc.quartierId',
                    foreignField: '_id',
                    as: 'blockDoc.quartierDoc'
                }
            }, {
                $lookup: {
                    from: 'wb_district',
                    localField: 'blockDoc.districtCode',
                    foreignField: '_id',
                    as: 'blockDoc.districtDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.districtDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'blockDoc.code': 1
                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    data: {
                        $push: {
                            blockId: '$blockId',
                            waterConsumption: '$waterConsumption',
                            dueAmount: '$dueAmount',
                            paidAmount: '$paidAmount',
                            saving: '$saving',
                            contributionFee: '$contributionFee',
                            maintenanceFee: '$maintenanceFee',
                            balance: '$balance',
                            grandTotal: '$grandTotal',
                            total: '$total',
                            numberOfInvoice: '$numberOfInvoice',
                            blockDoc: '$blockDoc'
                        }
                    },
                    totalByMonthWaterConsumption: {$sum: '$waterConsumption'},
                    totalByMonthDueAmount: {$sum: '$dueAmount'},
                    totalByMonthPaidAmount: {$sum: '$paidAmount'},
                    totalByMonthSaving: {$sum: '$saving'},
                    totalByMonthContributionFee: {$sum: '$contributionFee'},
                    totalByMonthMaintenanceFee: {$sum: '$maintenanceFee'},
                    totalByMonthBalance: {$sum: '$balance'},
                    totalByMonthGrandTotal: {$sum: '$grandTotal'},
                    totalByMonthTotal: {$sum: '$total'},
                    totalByMonthNumberOfInvoice: {$sum: '$numberOfInvoice'},

                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId'
                    },
                    dates: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            "data": "$data",
                            totalByMonthWaterConsumption: '$totalByMonthWaterConsumption',
                            totalByMonthDueAmount: '$totalByMonthDueAmount',
                            totalByMonthPaidAmount: '$totalByMonthPaidAmount',
                            totalByMonthSaving: '$totalByMonthSaving',
                            totalByMonthContributionFee: '$totalByMonthContributionFee',
                            totalByMonthMaintenanceFee: '$totalByMonthMaintenanceFee',
                            totalByMonthBalance: '$totalByMonthBalance',
                            totalByMonthGrandTotal: '$totalByMonthGrandTotal',
                            totalByMonthTotal: '$totalByMonthTotal',
                            totalByMonthNumberOfInvoice: '$totalByMonthNumberOfInvoice',
                        }
                    },
                    totalByUserWaterConsumption: {$sum: '$totalByMonthWaterConsumption'},
                    totalByUserDueAmount: {$sum: '$totalByMonthDueAmount'},
                    totalByUserPaidAmount: {$sum: '$totalByMonthPaidAmount'},
                    totalByUserSaving: {$sum: '$totalByMonthSaving'},
                    totalByUserContributionFee: {$sum: '$totalByMonthContributionFee'},
                    totalByUserMaintenanceFee: {$sum: '$totalByMonthMaintenanceFee'},
                    totalByUserBalance: {$sum: '$totalByMonthBalance'},
                    totalByUserGrandTotal: {$sum: '$totalByMonthGrandTotal'},
                    totalByUserTotal: {$sum: '$totalByMonthTotal'},
                    totalByUserNumberOfInvoice: {$sum: '$totalByMonthNumberOfInvoice'},
                }
            },


            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'userDoc'
                }
            },
            {
                $unwind: {
                    path: '$userDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    users: {
                        $push: '$$ROOT'
                    },
                    totalByTypeWaterConsumption: {$sum: '$totalByUserWaterConsumption'},
                    totalByTypeDueAmount: {$sum: '$totalByUserDueAmount'},
                    totalByTypePaidAmount: {$sum: '$totalByUserPaidAmount'},
                    totalByTypeSaving: {$sum: '$totalByUserSaving'},
                    totalByTypeContributionFee: {$sum: '$totalByUserContributionFee'},
                    totalByTypeMaintenanceFee: {$sum: '$totalByUserMaintenanceFee'},
                    totalByTypeBalance: {$sum: '$totalByUserBalance'},
                    totalByTypeGrandTotal: {$sum: '$totalByUserGrandTotal'},
                    totalByTypeTotal: {$sum: '$totalByUserTotal'},
                    totalByTypeNumberOfInvoice: {$sum: '$totalByUserNumberOfInvoice'},
                }
            }

        ]);


        if (payments.length > 0) {
            data.content = payments;
        }
        return data;
    },
    fetchDebtPaymentSummary(selector, selector2, selector3) {
        let data = {
            content: [],
            footer: {}
        };
        let payments = WB_Payment.aggregate([
            {
                $match: selector
            },
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDetailDoc'
                },

            }, {
                $unwind: {
                    path: '$meterReadingJournalDetailDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: selector2
            },
            //----------------------------//
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'meterReadingJournalDetailDoc.customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    street: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3]},
                    meterReadingJournalDetailDoc: 1,
                    customerDoc: 1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    withdrawing: 1,
                    createdBy: 1,
                    type: 1
                }
            },
            {
                $match: selector3
            },

            //----------------------------//
            {
                $group: {
                    _id: {
                        type: '$type',
                        blockId: '$meterReadingJournalDetailDoc.block',
                        userId: '$createdBy',
                        month: {$month: "$meterReadingJournalDetailDoc.newReadingDate"},
                        year: {$year: "$meterReadingJournalDetailDoc.newReadingDate"}
                    },
                    blockId: {
                        $last: '$meterReadingJournalDetailDoc.block'
                    },
                    waterConsumption: {
                        $sum: '$meterReadingJournalDetailDoc.waterConsumption'
                    },
                    dueAmount: {
                        $sum: '$dueAmount'
                    },
                    paidAmount: {
                        $sum: '$paidAmount'
                    },
                    saving: {
                        $sum: '$withdrawing'
                    },
                    contributionFee: {
                        $sum: '$meterReadingJournalDetailDoc.contributionFee'
                    },
                    maintenanceFee: {
                        $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
                    },
                    balance: {
                        $sum: '$balance'
                    },
                    grandTotal: {
                        $sum: '$meterReadingJournalDetailDoc.grandTotal'
                    },
                    total: {
                        $sum: '$meterReadingJournalDetailDoc.total'
                    },
                    numberOfInvoice: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'blockId',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'blockDoc.quartierId',
                    foreignField: '_id',
                    as: 'blockDoc.quartierDoc'
                }
            }, {
                $lookup: {
                    from: 'wb_district',
                    localField: 'blockDoc.districtCode',
                    foreignField: '_id',
                    as: 'blockDoc.districtDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.districtDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'blockDoc.code': 1
                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    data: {
                        $push: {
                            blockId: '$blockId',
                            waterConsumption: '$waterConsumption',
                            dueAmount: '$dueAmount',
                            paidAmount: '$paidAmount',
                            saving: '$saving',
                            contributionFee: '$contributionFee',
                            maintenanceFee: '$maintenanceFee',
                            balance: '$balance',
                            grandTotal: '$grandTotal',
                            total: '$total',
                            numberOfInvoice: '$numberOfInvoice',
                            blockDoc: '$blockDoc'
                        }
                    },
                    totalByMonthWaterConsumption: {$sum: '$waterConsumption'},
                    totalByMonthDueAmount: {$sum: '$dueAmount'},
                    totalByMonthPaidAmount: {$sum: '$paidAmount'},
                    totalByMonthSaving: {$sum: '$saving'},
                    totalByMonthContributionFee: {$sum: '$contributionFee'},
                    totalByMonthMaintenanceFee: {$sum: '$maintenanceFee'},
                    totalByMonthBalance: {$sum: '$balance'},
                    totalByMonthGrandTotal: {$sum: '$grandTotal'},
                    totalByMonthTotal: {$sum: '$total'},
                    totalByMonthNumberOfInvoice: {$sum: '$numberOfInvoice'},

                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId'
                    },
                    dates: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            "data": "$data",
                            totalByMonthWaterConsumption: '$totalByMonthWaterConsumption',
                            totalByMonthDueAmount: '$totalByMonthDueAmount',
                            totalByMonthPaidAmount: '$totalByMonthPaidAmount',
                            totalByMonthSaving: '$totalByMonthSaving',
                            totalByMonthContributionFee: '$totalByMonthContributionFee',
                            totalByMonthMaintenanceFee: '$totalByMonthMaintenanceFee',
                            totalByMonthBalance: '$totalByMonthBalance',
                            totalByMonthGrandTotal: '$totalByMonthGrandTotal',
                            totalByMonthTotal: '$totalByMonthTotal',
                            totalByMonthNumberOfInvoice: '$totalByMonthNumberOfInvoice',
                        }
                    },
                    totalByUserWaterConsumption: {$sum: '$totalByMonthWaterConsumption'},
                    totalByUserDueAmount: {$sum: '$totalByMonthDueAmount'},
                    totalByUserPaidAmount: {$sum: '$totalByMonthPaidAmount'},
                    totalByUserSaving: {$sum: '$totalByMonthSaving'},
                    totalByUserContributionFee: {$sum: '$totalByMonthContributionFee'},
                    totalByUserMaintenanceFee: {$sum: '$totalByMonthMaintenanceFee'},
                    totalByUserBalance: {$sum: '$totalByMonthBalance'},
                    totalByUserGrandTotal: {$sum: '$totalByMonthGrandTotal'},
                    totalByUserTotal: {$sum: '$totalByMonthTotal'},
                    totalByUserNumberOfInvoice: {$sum: '$totalByMonthNumberOfInvoice'},
                }
            },


            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'userDoc'
                }
            },
            {
                $unwind: {
                    path: '$userDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    users: {
                        $push: '$$ROOT'
                    },
                    totalByTypeWaterConsumption: {$sum: '$totalByUserWaterConsumption'},
                    totalByTypeDueAmount: {$sum: '$totalByUserDueAmount'},
                    totalByTypePaidAmount: {$sum: '$totalByUserPaidAmount'},
                    totalByTypeSaving: {$sum: '$totalByUserSaving'},
                    totalByTypeContributionFee: {$sum: '$totalByUserContributionFee'},
                    totalByTypeMaintenanceFee: {$sum: '$totalByUserMaintenanceFee'},
                    totalByTypeBalance: {$sum: '$totalByUserBalance'},
                    totalByTypeGrandTotal: {$sum: '$totalByUserGrandTotal'},
                    totalByTypeTotal: {$sum: '$totalByUserTotal'},
                    totalByTypeNumberOfInvoice: {$sum: '$totalByUserNumberOfInvoice'},
                }
            }

        ]);


        if (payments.length > 0) {
            data.content = payments;
        }
        return data;
    },
    fetchTransferPaymentSummary(selector,selector1, selector2, selector3) {
        let data = {
            content: [],
            content2:[],
            footer: {},
            footer2: {}
        };
        selector.transferBy={$exists:false};
        let payments = WB_Payment.aggregate([
            {
                $match: selector
            },
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDetailDoc'
                },

            }, {
                $unwind: {
                    path: '$meterReadingJournalDetailDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: selector2
            },
            //----------------------------//
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'meterReadingJournalDetailDoc.customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    street: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3]},
                    meterReadingJournalDetailDoc: 1,
                    customerDoc: 1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    withdrawing: 1,
                    createdBy: 1,
                    type: 1
                }
            },
            {
                $match: selector3
            },

            //----------------------------//
            {
                $group: {
                    _id: {
                        type: '$type',
                        blockId: '$meterReadingJournalDetailDoc.block',
                        userId: '$createdBy',
                        month: {$month: "$meterReadingJournalDetailDoc.newReadingDate"},
                        year: {$year: "$meterReadingJournalDetailDoc.newReadingDate"}
                    },
                    blockId: {
                        $last: '$meterReadingJournalDetailDoc.block'
                    },
                    waterConsumption: {
                        $sum: '$meterReadingJournalDetailDoc.waterConsumption'
                    },
                    dueAmount: {
                        $sum: '$dueAmount'
                    },
                    paidAmount: {
                        $sum: '$paidAmount'
                    },
                    saving: {
                        $sum: '$withdrawing'
                    },
                    contributionFee: {
                        $sum: '$meterReadingJournalDetailDoc.contributionFee'
                    },
                    maintenanceFee: {
                        $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
                    },
                    balance: {
                        $sum: '$balance'
                    },
                    grandTotal: {
                        $sum: '$meterReadingJournalDetailDoc.grandTotal'
                    },
                    total: {
                        $sum: '$meterReadingJournalDetailDoc.total'
                    },
                    numberOfInvoice: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'blockId',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'blockDoc.quartierId',
                    foreignField: '_id',
                    as: 'blockDoc.quartierDoc'
                }
            }, {
                $lookup: {
                    from: 'wb_district',
                    localField: 'blockDoc.districtCode',
                    foreignField: '_id',
                    as: 'blockDoc.districtDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.districtDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'blockDoc.code': 1
                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    data: {
                        $push: {
                            blockId: '$blockId',
                            waterConsumption: '$waterConsumption',
                            dueAmount: '$dueAmount',
                            paidAmount: '$paidAmount',
                            saving: '$saving',
                            contributionFee: '$contributionFee',
                            maintenanceFee: '$maintenanceFee',
                            balance: '$balance',
                            grandTotal: '$grandTotal',
                            total: '$total',
                            numberOfInvoice: '$numberOfInvoice',
                            blockDoc: '$blockDoc'
                        }
                    },
                    totalByMonthWaterConsumption: {$sum: '$waterConsumption'},
                    totalByMonthDueAmount: {$sum: '$dueAmount'},
                    totalByMonthPaidAmount: {$sum: '$paidAmount'},
                    totalByMonthSaving: {$sum: '$saving'},
                    totalByMonthContributionFee: {$sum: '$contributionFee'},
                    totalByMonthMaintenanceFee: {$sum: '$maintenanceFee'},
                    totalByMonthBalance: {$sum: '$balance'},
                    totalByMonthGrandTotal: {$sum: '$grandTotal'},
                    totalByMonthTotal: {$sum: '$total'},
                    totalByMonthNumberOfInvoice: {$sum: '$numberOfInvoice'},

                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId'
                    },
                    dates: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            "data": "$data",
                            totalByMonthWaterConsumption: '$totalByMonthWaterConsumption',
                            totalByMonthDueAmount: '$totalByMonthDueAmount',
                            totalByMonthPaidAmount: '$totalByMonthPaidAmount',
                            totalByMonthSaving: '$totalByMonthSaving',
                            totalByMonthContributionFee: '$totalByMonthContributionFee',
                            totalByMonthMaintenanceFee: '$totalByMonthMaintenanceFee',
                            totalByMonthBalance: '$totalByMonthBalance',
                            totalByMonthGrandTotal: '$totalByMonthGrandTotal',
                            totalByMonthTotal: '$totalByMonthTotal',
                            totalByMonthNumberOfInvoice: '$totalByMonthNumberOfInvoice',
                        }
                    },
                    totalByUserWaterConsumption: {$sum: '$totalByMonthWaterConsumption'},
                    totalByUserDueAmount: {$sum: '$totalByMonthDueAmount'},
                    totalByUserPaidAmount: {$sum: '$totalByMonthPaidAmount'},
                    totalByUserSaving: {$sum: '$totalByMonthSaving'},
                    totalByUserContributionFee: {$sum: '$totalByMonthContributionFee'},
                    totalByUserMaintenanceFee: {$sum: '$totalByMonthMaintenanceFee'},
                    totalByUserBalance: {$sum: '$totalByMonthBalance'},
                    totalByUserGrandTotal: {$sum: '$totalByMonthGrandTotal'},
                    totalByUserTotal: {$sum: '$totalByMonthTotal'},
                    totalByUserNumberOfInvoice: {$sum: '$totalByMonthNumberOfInvoice'},
                }
            },


            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'userDoc'
                }
            },
            {
                $unwind: {
                    path: '$userDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    users: {
                        $push: '$$ROOT'
                    },
                    totalByTypeWaterConsumption: {$sum: '$totalByUserWaterConsumption'},
                    totalByTypeDueAmount: {$sum: '$totalByUserDueAmount'},
                    totalByTypePaidAmount: {$sum: '$totalByUserPaidAmount'},
                    totalByTypeSaving: {$sum: '$totalByUserSaving'},
                    totalByTypeContributionFee: {$sum: '$totalByUserContributionFee'},
                    totalByTypeMaintenanceFee: {$sum: '$totalByUserMaintenanceFee'},
                    totalByTypeBalance: {$sum: '$totalByUserBalance'},
                    totalByTypeGrandTotal: {$sum: '$totalByUserGrandTotal'},
                    totalByTypeTotal: {$sum: '$totalByUserTotal'},
                    totalByTypeNumberOfInvoice: {$sum: '$totalByUserNumberOfInvoice'},
                }
            }

        ]);

        selector1.transferBy={$exists:true};
        let payments2 = WB_Payment.aggregate([
            {
                $match: selector1
            },
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDetailDoc'
                },

            }, {
                $unwind: {
                    path: '$meterReadingJournalDetailDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: selector2
            },
            //----------------------------//
            {
                $project: {
                    street: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3]},
                    meterReadingJournalDetailDoc: 1,
                    customerDoc: 1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    withdrawing: 1,
                    createdBy: 1,
                    type: 1
                }
            },
            {
                $match: selector3
            },
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'meterReadingJournalDetailDoc.customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            //----------------------------//
            {
                $group: {
                    _id: {
                        type: '$type',
                        blockId: '$meterReadingJournalDetailDoc.block',
                        userId: '$createdBy',
                        month: {$month: "$meterReadingJournalDetailDoc.newReadingDate"},
                        year: {$year: "$meterReadingJournalDetailDoc.newReadingDate"}
                    },
                    blockId: {
                        $last: '$meterReadingJournalDetailDoc.block'
                    },
                    waterConsumption: {
                        $sum: '$meterReadingJournalDetailDoc.waterConsumption'
                    },
                    dueAmount: {
                        $sum: '$dueAmount'
                    },
                    paidAmount: {
                        $sum: '$paidAmount'
                    },
                    saving: {
                        $sum: '$withdrawing'
                    },
                    contributionFee: {
                        $sum: '$meterReadingJournalDetailDoc.contributionFee'
                    },
                    maintenanceFee: {
                        $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
                    },
                    balance: {
                        $sum: '$balance'
                    },
                    grandTotal: {
                        $sum: '$meterReadingJournalDetailDoc.grandTotal'
                    },
                    total: {
                        $sum: '$meterReadingJournalDetailDoc.total'
                    },
                    numberOfInvoice: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'blockId',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'blockDoc.quartierId',
                    foreignField: '_id',
                    as: 'blockDoc.quartierDoc'
                }
            }, {
                $lookup: {
                    from: 'wb_district',
                    localField: 'blockDoc.districtCode',
                    foreignField: '_id',
                    as: 'blockDoc.districtDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.districtDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'blockDoc.code': 1
                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    data: {
                        $push: {
                            blockId: '$blockId',
                            waterConsumption: '$waterConsumption',
                            dueAmount: '$dueAmount',
                            paidAmount: '$paidAmount',
                            saving: '$saving',
                            contributionFee: '$contributionFee',
                            maintenanceFee: '$maintenanceFee',
                            balance: '$balance',
                            grandTotal: '$grandTotal',
                            total: '$total',
                            numberOfInvoice: '$numberOfInvoice',
                            blockDoc: '$blockDoc'
                        }
                    },
                    totalByMonthWaterConsumption: {$sum: '$waterConsumption'},
                    totalByMonthDueAmount: {$sum: '$dueAmount'},
                    totalByMonthPaidAmount: {$sum: '$paidAmount'},
                    totalByMonthSaving: {$sum: '$saving'},
                    totalByMonthContributionFee: {$sum: '$contributionFee'},
                    totalByMonthMaintenanceFee: {$sum: '$maintenanceFee'},
                    totalByMonthBalance: {$sum: '$balance'},
                    totalByMonthGrandTotal: {$sum: '$grandTotal'},
                    totalByMonthTotal: {$sum: '$total'},
                    totalByMonthNumberOfInvoice: {$sum: '$numberOfInvoice'},

                }
            },
            {
                $group: {
                    _id: {
                        type: '$_id.type',
                        userId: '$_id.userId'
                    },
                    dates: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            "data": "$data",
                            totalByMonthWaterConsumption: '$totalByMonthWaterConsumption',
                            totalByMonthDueAmount: '$totalByMonthDueAmount',
                            totalByMonthPaidAmount: '$totalByMonthPaidAmount',
                            totalByMonthSaving: '$totalByMonthSaving',
                            totalByMonthContributionFee: '$totalByMonthContributionFee',
                            totalByMonthMaintenanceFee: '$totalByMonthMaintenanceFee',
                            totalByMonthBalance: '$totalByMonthBalance',
                            totalByMonthGrandTotal: '$totalByMonthGrandTotal',
                            totalByMonthTotal: '$totalByMonthTotal',
                            totalByMonthNumberOfInvoice: '$totalByMonthNumberOfInvoice',
                        }
                    },
                    totalByUserWaterConsumption: {$sum: '$totalByMonthWaterConsumption'},
                    totalByUserDueAmount: {$sum: '$totalByMonthDueAmount'},
                    totalByUserPaidAmount: {$sum: '$totalByMonthPaidAmount'},
                    totalByUserSaving: {$sum: '$totalByMonthSaving'},
                    totalByUserContributionFee: {$sum: '$totalByMonthContributionFee'},
                    totalByUserMaintenanceFee: {$sum: '$totalByMonthMaintenanceFee'},
                    totalByUserBalance: {$sum: '$totalByMonthBalance'},
                    totalByUserGrandTotal: {$sum: '$totalByMonthGrandTotal'},
                    totalByUserTotal: {$sum: '$totalByMonthTotal'},
                    totalByUserNumberOfInvoice: {$sum: '$totalByMonthNumberOfInvoice'},
                }
            },


            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'userDoc'
                }
            },
            {
                $unwind: {
                    path: '$userDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    users: {
                        $push: '$$ROOT'
                    },
                    totalByTypeWaterConsumption: {$sum: '$totalByUserWaterConsumption'},
                    totalByTypeDueAmount: {$sum: '$totalByUserDueAmount'},
                    totalByTypePaidAmount: {$sum: '$totalByUserPaidAmount'},
                    totalByTypeSaving: {$sum: '$totalByUserSaving'},
                    totalByTypeContributionFee: {$sum: '$totalByUserContributionFee'},
                    totalByTypeMaintenanceFee: {$sum: '$totalByUserMaintenanceFee'},
                    totalByTypeBalance: {$sum: '$totalByUserBalance'},
                    totalByTypeGrandTotal: {$sum: '$totalByUserGrandTotal'},
                    totalByTypeTotal: {$sum: '$totalByUserTotal'},
                    totalByTypeNumberOfInvoice: {$sum: '$totalByUserNumberOfInvoice'},
                }
            }

        ]);
        if (payments.length > 0) {
            data.content = payments;
        }
        if (payments2.length > 0) {
            data.content2 = payments2;
        }
        return data;
    },
    fetchPaymentForTransfer(selector, selector2, selector3) {
        let payments = WB_Payment.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDetailDoc'
                }
            },
            {$unwind: {path: '$meterReadingJournalDetailDoc', preserveNullAndEmptyArrays: true}},

            {
                $match: selector2
            },
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'meterReadingJournalDetailDoc.customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },

            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            //Just custom will update later
            //----------------------------//
            {
                $project: {
                    blockCode: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 0, 2]},
                    street: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3]},
                    meterReadingJournalDetailDoc: 1,
                    customerDoc: 1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    createdBy: 1,
                }
            },
            {
                $match: selector3
            },
            {
                $sort: {'meterReadingJournalDetailDoc.dpc': 1}
            },

            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'meterReadingJournalDetailDoc.block',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },

            {
                $unwind: {
                    path: '$blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'blockDoc.quartierId',
                    foreignField: '_id',
                    as: 'blockDoc.quartierDoc'
                }
            }, {
                $lookup: {
                    from: 'wb_district',
                    localField: 'blockDoc.districtCode',
                    foreignField: '_id',
                    as: 'blockDoc.districtDoc'
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$blockDoc.districtDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'blockDoc.code': 1,
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: '$$ROOT'
                    },
                    totalWaterConsumption: {
                        $sum: '$meterReadingJournalDetailDoc.waterConsumption'
                    },
                    totalMaintenanceFee: {
                        $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
                    },
                    totalContributionFee: {
                        $sum: '$meterReadingJournalDetailDoc.contributionFee'
                    },
                    totalWaterUsage: {
                        $sum: '$meterReadingJournalDetailDoc.total'
                    },
                    totalPaidAmount: {
                        $sum: '$paidAmount'
                    },
                    totalDueAmount: {
                        $sum: '$dueAmount'
                    },
                    totalBalance: {
                        $sum: '$balance'
                    },
                    numberOfInvoice: {
                        $sum: 1
                    }
                }
            },

        ]);
        return payments[0];
    }
});

/*aggregate([
 {
 $match: selector
 },
 {
 $lookup: {
 from: 'wb_meterReadingJournalDetails',
 localField: 'meterJournalId',
 foreignField: '_id',
 as: 'meterReadingJournalDetailDoc'
 },

 }, {
 $unwind: {
 path: '$meterReadingJournalDetailDoc',
 preserveNullAndEmptyArrays: true
 }
 },
 {
 $match:selector2
 },

 {
 $group: {
 _id: {
 blockId: '$meterReadingJournalDetailDoc.block',
 userId: '$createdBy',
 date: { $month: "$date" }
 },
 blockId: {
 $last: '$meterReadingJournalDetailDoc.block'
 },
 waterConsumption: {
 $sum: '$meterReadingJournalDetailDoc.waterConsumption'
 },
 dueAmount: {
 $sum: '$dueAmount'
 },
 paidAmount: {
 $sum: '$paidAmount'
 },
 saving: {
 $sum: '$withdrawing'
 },
 contributionFee: {
 $sum: '$meterReadingJournalDetailDoc.contributionFee'
 },
 maintenanceFee: {
 $sum: '$meterReadingJournalDetailDoc.maintenanceFee'
 },
 balance: {
 $sum: '$balance'
 },
 grandTotal: {
 $sum: '$meterReadingJournalDetailDoc.grandTotal'
 },
 total: {
 $sum: '$meterReadingJournalDetailDoc.total'
 },
 numberOfInvoice: {$sum: 1}
 }
 },
 {
 $lookup: {
 from: 'wb_block',
 localField: 'blockId',
 foreignField: '_id',
 as: 'blockDoc'
 }
 },
 {
 $unwind: {
 path: '$blockDoc',
 preserveNullAndEmptyArrays: true
 }
 },
 {
 $lookup: {
 from: 'wb_quartier',
 localField: 'blockDoc.quartierId',
 foreignField: '_id',
 as: 'blockDoc.quartierDoc'
 }
 }, {
 $lookup: {
 from: 'wb_district',
 localField: 'blockDoc.districtCode',
 foreignField: '_id',
 as: 'blockDoc.districtDoc'
 }
 },
 {
 $unwind: {
 path: '$blockDoc.quartierDoc',
 preserveNullAndEmptyArrays: true
 }
 },
 {
 $unwind: {
 path: '$blockDoc.districtDoc',
 preserveNullAndEmptyArrays: true
 }
 },
 {
 $group: {
 _id: '$_id.userId',
 data: {
 $push: '$$ROOT'
 }
 }
 },
 {
 $lookup: {
 from: 'users',
 localField: '_id',
 foreignField: '_id',
 as: 'userDoc'
 }
 },
 {
 $unwind: {
 path: '$userDoc',
 preserveNullAndEmptyArrays: true
 }
 }
 ]);*/