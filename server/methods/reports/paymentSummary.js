import {WB_Payment} from '../../../imports/collection/payment';


Meteor.methods({
    fetchPaymentSummary(selector,selector2) {
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
                    street: { $substr: ["$meterReadingJournalDetailDoc.streetNo", 3, 3] },
                    meterReadingJournalDetailDoc:1,
                    customerDoc:1,
                    paidAmount: 1,
                    dueAmount: 1,
                    date: 1,
                    balance: 1,
                    withdrawing:1,
                    createdBy:1,
                }
            },
            {
                $match: selector2
            },
            //----------------------------//

            {
                $group: {
                    _id: {
                        blockId: '$meterReadingJournalDetailDoc.block',
                        userId: '$createdBy'
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
                $sort:{'blockDoc.code':1}
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
        ]);
        if (payments.length > 0) {
            data.content = payments;
        }
        return data;
    }
});