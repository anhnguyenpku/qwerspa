import {Meteor} from 'meteor/meteor';
import {Wb_meterReadingJournal} from '../../../imports/collection/meterReadingJournal';

Meteor.methods({
    meterReadingJournalReport({selector}){
        if (Meteor.userId()) {
            let meterReadingJournalReport = Wb_meterReadingJournal.aggregate([
                {$match: selector},
                {
                    $lookup: {
                        from: 'wb_meterReadingJournalDetails',
                        localField: '_id',
                        foreignField: 'meterReadingJournalId',
                        as: 'meterReadingJournalDetail'
                    }
                },
                {
                    $unwind: {
                        path: '$meterReadingJournalDetail', preserveNullAndEmptyArrays: true
                    }
                },
                // {
                //     $match: journalSelector
                // },
                {
                    $lookup: {
                        from: 'wb_customer',
                        localField: 'meterReadingJournalDetail.customerId',
                        foreignField: '_id',
                        as: 'meterReadingJournalDetail.customerDoc'
                    }
                },
                {
                    $unwind: {path: '$meterReadingJournalDetail.customerDoc', preserveNullAndEmptyArrays: true}
                },
                {
                    $lookup: {
                        from: 'wb_meterType',
                        localField: 'meterReadingJournalDetail.customerDoc.contract.meterTypeId',
                        foreignField: '_id',
                        as: 'meterReadingJournalDetail.meterDoc'
                    }
                },
                {
                    $unwind: {path: '$meterReadingJournalDetail.meterDoc', preserveNullAndEmptyArrays: true}
                },
                {
                    $lookup: {
                        from: 'wb_category',
                        localField: 'meterReadingJournalDetail.customerDoc.category',
                        foreignField: '_id',
                        as: 'meterReadingJournalDetail.categoryDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_tariff',
                        localField: 'meterReadingJournalDetail.customerDoc.tariff',
                        foreignField: '_id',
                        as: 'meterReadingJournalDetail.tariffDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_district',
                        localField: 'meterReadingJournalDetail.district',
                        foreignField: '_id',
                        as: 'districtDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_quartier',
                        localField: 'meterReadingJournalDetail.quartier',
                        foreignField: '_id',
                        as: 'quartierDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_block',
                        localField: 'meterReadingJournalDetail.block',
                        foreignField: '_id',
                        as: 'blockDoc'
                    }
                },
                {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$meterReadingJournalDetail.categoryDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$meterReadingJournalDetail.tariffDoc', preserveNullAndEmptyArrays: true}},
                {$sort: {"meterReadingJournalDetail.dpc" :1}},
                // {$sort: {"meterReadingJournalDetail.customerDoc.dpc" :1}},
                {
                    $group: {
                        _id: {
                            _id: '$_id',
                            districtId: '$districtDoc._id',
                            quarterId: '$quartierDoc._id',
                            blockId: '$blockDoc._id'
                        },
                        batchName: {
                            $last: '$date'
                        },
                        header: {
                            $last: {
                                district: '$districtDoc',
                                quartier: '$quartierDoc',
                                block: '$blockDoc',
                                billingPeriod: '$date'
                            }
                        },
                        sumQty: {
                            $sum: "$meterReadingJournalDetail.waterConsumption"
                        },
                        meterReadingJournalDetail: {$push: '$meterReadingJournalDetail'}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        header: 1,
                        sumQty: 1,
                        meterReadingJournalDetail: 1
                    }
                }
            ]);
            return meterReadingJournalReport;
        }
    }
});