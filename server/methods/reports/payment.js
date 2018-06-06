import {Meteor} from 'meteor/meteor';
import {WB_Payment} from '../../../imports/collection/payment';
Meteor.methods({
    paymentReport(selector, selector2, selector3){

        /*  if (params.customerId && params.customerId != '') {
         selector.customerId = params.customerId;
         }
         if (params.district && params.district != '') {
         selector.district = params.district;
         }
         if (params.quartier && params.quartier != '') {
         selector.quartier = params.quartier;
         }
         if (params.block && params.block != '') {
         selector.block = params.block;
         }
         if (params.category && params.category != '') {
         selector.category = params.category;
         }*/
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
                    street: {$substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3]},
                    meterReadingJournalDetailDoc: 1,
                    customerDoc: 1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    createdBy: 1
                }
            },
            {
                $match: selector3
            },
            //----------------------------//

            /*  {
             $lookup: {
             from: 'wb_category',
             localField: 'category',
             foreignField: '_id',
             as: 'categoryDoc'
             }
             },
             {
             $lookup: {
             from: 'wb_class',
             localField: 'class',
             foreignField: '_id',
             as: 'classDoc'
             }
             },
             {
             $lookup: {
             from: 'wb_district',
             localField: 'district',
             foreignField: '_id',
             as: 'districtDoc'
             }
             },
             {
             $lookup: {
             from: 'wb_quartier',
             localField: 'quartier',
             foreignField: '_id',
             as: 'quartierDoc'
             }
             },
             {
             $lookup: {
             from: 'wb_block',
             localField: 'block',
             foreignField: '_id',
             as: 'blockDoc'
             }
             },
             {
             $lookup: {
             from: 'wb_meterType',
             localField: 'customerDoc.contract.meterTypeId',
             foreignField: '_id',
             as: 'meterTypeDoc'
             }
             },*/



            /*
             {$unwind: {path: '$categoryDoc', preserveNullAndEmptyArrays: true}},
             {$unwind: {path: '$classDoc', preserveNullAndEmptyArrays: true}},
             {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
             {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
             {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
             {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}},*/
            {
                $sort: {'meterReadingJournalDetailDoc.dpc': 1}
            },
            {
                $group: {
                    _id: {
                        blockId: '$meterReadingJournalDetailDoc.block',
                    },
                    blockId: {
                        $last: '$meterReadingJournalDetailDoc.block'
                    },
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
                    'blockDoc.code': 1,
                }
            },
            {
                $group: {
                    _id: null,
                    blocks: {
                        $push: '$$ROOT'
                    },
                    totalWaterConsumption: {
                        $sum: '$totalWaterConsumption'
                    },
                    totalMaintenanceFee: {
                        $sum: '$totalMaintenanceFee'
                    },
                    totalContributionFee: {
                        $sum: '$totalContributionFee'
                    },
                    totalWaterUsage: {
                        $sum: '$totalWaterUsage'
                    },
                    totalPaidAmount: {
                        $sum: '$totalPaidAmount'
                    },
                    totalDueAmount: {
                        $sum: '$totalDueAmount'
                    },
                    totalBalance: {
                        $sum: '$totalBalance'
                    },
                    numberOfInvoice: {
                        $sum: '$numberOfInvoice'
                    }
                }
            }
        ]);
        return payments[0];
    },
    tellerPaymentReport(selector, selector2){
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

            {
                $group: {
                    _id: {
                        type: '$type',
                        month: {$month: "$meterReadingJournalDetailDoc.newReadingDate"},
                        year: {$year: "$meterReadingJournalDetailDoc.newReadingDate"}
                    },
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
                        $sum: '$dueBalance'
                    },
                }
            },
            {
                $group: {
                    _id: {
                        type: '$type'
                    },
                    data: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
                            data: '$data',
                            totalWaterConsumption: '$totalWaterConsumption',
                            totalMaintenanceFee: '$totalMaintenanceFee',
                            totalContributionFee: '$totalContributionFee',
                            totalWaterUsage: '$totalWaterUsage',
                            totalPaidAmount: '$totalPaidAmount',
                            totalDueAmount: '$totalDueAmount',
                            totalBalance: '$totalBalance',
                        }
                    },
                    totalWaterConsumption: {
                        $sum: '$totalWaterConsumption'
                    },
                    totalMaintenanceFee: {
                        $sum: '$totalMaintenanceFee'
                    },
                    totalContributionFee: {
                        $sum: '$totalContributionFee'
                    },
                    totalWaterUsage: {
                        $sum: '$totalWaterUsage'
                    },
                    totalPaidAmount: {
                        $sum: '$totalPaidAmount'
                    },
                    totalDueAmount: {
                        $sum: '$totalDueAmount'
                    },
                    totalBalance: {
                        $sum: '$totalBalance'
                    },
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            type: '$_id.type',
                            data: '$data',
                            totalWaterConsumption: '$totalWaterConsumption',
                            totalMaintenanceFee: '$totalMaintenanceFee',
                            totalContributionFee: '$totalContributionFee',
                            totalWaterUsage: '$totalWaterUsage',
                            totalPaidAmount: '$totalPaidAmount',
                            totalDueAmount: '$totalDueAmount',
                            totalBalance: '$totalBalance',
                        }
                    },
                    totalWaterConsumption: {
                        $sum: '$totalWaterConsumption'
                    },
                    totalMaintenanceFee: {
                        $sum: '$totalMaintenanceFee'
                    },
                    totalContributionFee: {
                        $sum: '$totalContributionFee'
                    },
                    totalWaterUsage: {
                        $sum: '$totalWaterUsage'
                    },
                    totalPaidAmount: {
                        $sum: '$totalPaidAmount'
                    },
                    totalDueAmount: {
                        $sum: '$totalDueAmount'
                    },
                    totalBalance: {
                        $sum: '$totalBalance'
                    },
                }
            }
        ]);
        return payments[0];
    }
});