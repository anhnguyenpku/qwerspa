import {Meteor} from 'meteor/meteor';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js';

Meteor.methods({
    unpaidCustomerReport(params, selector2) {
        let selector = {};
        let date = moment(params.date).endOf('days').toDate();
        if (params.date && params.month && params.month.length > 0) {
            if(params.month[0] && params.month[1]){
                let startOfMonth = moment(params.month[0]).startOf('month').toDate();
                let endOfMonth = moment(params.month[1]).endOf('month').toDate();
                selector.$and = [
                    {newReadingDate: {$lte: date}},
                    // prevReadingDate: {$lte: startOfMonth}, //
                    {newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}}];
            }else{
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
                    newReadingDate: 1,
                    waterConsumption: 1,
                    maintenanceFee: 1,
                    contributionFee: 1,
                    total: 1,
                    grandTotal: 1,
                    balance: 1,
                    streetNo:1,
                    dpc:1,
                }
            },
            {
                $match: selector2
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
            {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}},
            {
                $sort: {
                    'dpc': 1
                }
            },
            {
                $group: {
                    _id: {
                        month: {$month: "$newReadingDate"},
                        year: {$year: "$newReadingDate"}
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
                    '_id.year': 1, '_id.month': 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
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
        ]);
        return unpaidCustomers[0];
    },
    customerUnpaidCustomerReport(params, selector2) {
        let selector = {};
        let date = moment(params.date).endOf('days').toDate();
        if (params.date && params.month) {
                let startOfMonth = moment(params.month).startOf('month').toDate();
                let endOfMonth = moment(params.month).endOf('month').toDate();
                selector.$and = [
                    {newReadingDate: {$lte: date}},
                    // prevReadingDate: {$lte: startOfMonth}, //
                    {newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}}];
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
                    from: 'wb_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
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
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            //Just custom will update later
            //----------------------------//
            {
                $project: {
                    street: {$substr: ["$streetNo", 3, -1]},
                    customerDoc: 1,
                    newReadingDate: 1,
                    waterConsumption: 1,
                    maintenanceFee: 1,
                    contributionFee: 1,
                    total: 1,
                    grandTotal: 1,
                    balance: 1,
                    streetNo:1,
                    dpc:1,
                }
            },
            {
                $match: selector2
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
            {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}},
            {
                $sort: {
                    'dpc': 1
                }
            },
            {
                $group: {
                    _id: {
                        month: {$month: "$newReadingDate"},
                        year: {$year: "$newReadingDate"}
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
                    '_id.year': 1, '_id.month': 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            month: "$_id.month",
                            year: "$_id.year",
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
        ]);
        return unpaidCustomers[0];
    }
});