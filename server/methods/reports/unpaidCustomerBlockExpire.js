import {Meteor} from 'meteor/meteor';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';

Meteor.methods({
    unpaidCustomerBlockExpireReport(params, selector2) {
        let selector = {};
        let wbSetup = WB_waterBillingSetup.findOne({rolesArea: params.rolesArea});
        let date = moment(params.date).endOf('days').toDate();
        if (params.date && params.month && params.month.length > 0) {
            if (params.month[0] && params.month[1]) {
                let startOfMonth = moment(params.month[0]).startOf('month').toDate();
                let endOfMonth = moment(params.month[1]).endOf('month').toDate();
                selector.$and = [
                    {rolesArea: params.rolesArea},
                    {newReadingDate: {$lte: moment(date).endOf("days").add(-(wbSetup && wbSetup.invoiceExpiredAfter || 25), "day").toDate()}},
                    // prevReadingDate: {$lte: startOfMonth}, //
                    {newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}}];
            } else {
                selector.newReadingDate = {$lte: date};
            }
        } else if (params.date) {
            selector.newReadingDate = {$lte: date};
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
        }

        selector.$or = [{paymentStatus: {$ne: "closed"}}, {closedAt: {$gt: date}}];
        // selector.closedAt={$gte:date};
        selector.newReading = {$exists: true};
        selector.waterConsumption = {$ne: 0};

        let unpaidCustomers = WB_MeterReadingJournalDetail.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: 'wb_category',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDoc'
                }
            }, {
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
            {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'wb_quartier',
                    localField: 'quartier',
                    foreignField: '_id',
                    as: 'quartierDoc'
                }
            },
            {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},

            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'block',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'wb_requestCuttingWater',
                    localField: '_id',
                    foreignField: 'journalBookDetailId',
                    as: 'requestCuttingWaterDoc'
                }
            },
            {$unwind: {path: '$requestCuttingWaterDoc', preserveNullAndEmptyArrays: true}},
            {
                $match: selector2
            },
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},

            //Just custom will update later
            //----------------------------//
            {
                $project: {
                    street: {$substr: ["$streetNo", 3, 3]},
                    customerDoc: 1,
                    blockDoc: 1,
                    quartierDoc: 1,
                    districtCode: "$districtDoc.code",
                    newReadingDate: 1,
                    dayExpire: {$subtract: [moment(params.date).startOf("days").toDate(), "$newReadingDate"]},
                    waterConsumption: 1,
                    maintenanceFee: 1,
                    contributionFee: 1,
                    total: 1,
                    grandTotal: 1,
                    balance: 1,
                    streetNo: 1,
                    barcode: 1,
                    dpc: 1,
                    desc: {$ifNull: ['$requestCuttingWaterDoc.desc', '']},
                    closedAt: {$ifNull: ['$requestCuttingWaterDoc.closedAt', '']}
                }
            },

            //----------------------------//


            {
                $lookup: {
                    from: 'wb_meterType',
                    localField: 'customerDoc.contract.meterTypeId',
                    foreignField: '_id',
                    as: 'meterTypeDoc'
                }
            },
            {$unwind: {path: '$categoryDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$classDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}},
            {
                $sort: {
                    'dpc': 1
                }
            },

            {
                $group: {
                    _id: {
                        blockDoc: "$blockDoc",
                        quartierDoc: "$quartierDoc",
                        districtCode: "$districtCode",
                        customerDoc: "$customerDoc"
                    },
                    data: {
                        $push: '$$ROOT'
                    },
                    totalWaterConsumption: {
                        $sum: '$waterConsumption'
                    },
                    totalMaintenanceFee: {
                        $sum: '$maintenanceFee'
                    },
                    totalContributionFee: {
                        $sum: '$contributionFee'
                    },
                    totalWaterUsage: {
                        $sum: '$total'
                    },
                    totalGrandTotal: {
                        $sum: '$grandTotal'
                    },
                    totalBalance: {
                        $sum: '$balance'
                    }
                }
            },
            {
                $sort: {
                    'districtCode': 1, 'quartierDoc.code': 1, '_id.blockDoc.code': 1, '_id.customerDoc._id': 1
                }
            },
            {
                $group: {
                    _id: {
                        blockDoc: "$_id.blockDoc",
                        districtCode: "$_id.districtCode",
                        quartierDoc: "$_id.quartierDoc"
                    },
                    data: {
                        $push: {
                            customerDoc: "$_id.customerDoc",
                            "data": "$data",
                            totalWaterConsumption: '$totalWaterConsumption',
                            totalMaintenanceFee: '$totalMaintenanceFee',
                            totalContributionFee: '$totalContributionFee',
                            totalWaterUsage: '$totalWaterUsage',
                            totalGrandTotal: '$totalGrandTotal',
                            totalBalance: '$totalBalance',
                        }
                    },
                    totalWaterConsumption: {
                        $sum: '$totalWaterConsumption',
                    },
                    totalMaintenanceFee: {
                        $sum: '$totalMaintenanceFee',
                    },
                    totalContributionFee: {
                        $sum: '$totalContributionFee',
                    },
                    totalWaterUsage: {
                        $sum: '$totalWaterUsage'
                    },
                    totalGrandTotal: {
                        $sum: '$totalGrandTotal',
                    },
                    totalBalance: {
                        $sum: '$totalBalance',
                    }

                }
            },
            {
                $sort: {
                    '_id.districtCode': 1,
                    '_id.quartierDoc.code': 1,
                    '_id.blockDoc.code': 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            blockDoc: "$_id.blockDoc",
                            quartierDoc: "$_id.quartierDoc",
                            districtCode: "$_id.districtCode",
                            "data": "$data",
                            totalWaterConsumption: '$totalWaterConsumption',
                            totalMaintenanceFee: '$totalMaintenanceFee',
                            totalContributionFee: '$totalContributionFee',
                            totalWaterUsage: '$totalWaterUsage',
                            totalGrandTotal: '$totalGrandTotal',
                            totalBalance: '$totalBalance',
                        }
                    },
                    totalWaterConsumption: {
                        $sum: '$totalWaterConsumption',
                    },
                    totalMaintenanceFee: {
                        $sum: '$totalMaintenanceFee',
                    },
                    totalContributionFee: {
                        $sum: '$totalContributionFee',
                    },
                    totalWaterUsage: {
                        $sum: '$totalWaterUsage'
                    },
                    totalGrandTotal: {
                        $sum: '$totalGrandTotal',
                    },
                    totalBalance: {
                        $sum: '$totalBalance',
                    }

                }
            }
        ], {allowDiskUse: true});
        return unpaidCustomers[0];
    }
});