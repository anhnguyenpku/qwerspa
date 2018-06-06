import {Wb_meterReadingJournal, WB_MeterReadingJournalDetail} from '../../collection/meterReadingJournal';
import moment from 'moment';
import UploadJBD from './upload.js'
import {WB_Customer} from "../../collection/customer";
import {CheckRoles} from '../methods/checkRoles';
import {Description} from '../../collection/description';
import {WB_RequestUpdateJournalDetail} from '../../collection/requestUpdateJournalDetail';
import {WB_MetersReading} from "../../collection/meterReading";

export default class MobileApi {
    static checkLogin(user, password) {
        let detailLogin = Accounts._checkPassword(user, password);
        if (detailLogin.error) {
            return detailLogin;
        }
        return user;
    }

    static checkRoles(userId, roles) {
        return CheckRoles({userId, roles})
    }

    static queryUserByUsername(username, password) {
        if (!!username) {
            let user = Meteor.users.findOne({username});
            if (!!user) {
                return this.checkLogin(user, password);
            }
            return {error: {error: 404, message: 'Username not exist'}};
        }
    }

    // lookup journal book
    static JournalBookByUser(userId, rolesArea, uuids) {
        let startOfMonth = moment().startOf('months').toDate();
        let endOfMonth = moment().endOf('months').toDate();
        let selector = {
            rolesArea: {$in: rolesArea},
            date: {$gte: startOfMonth},
            isLocked: {$in: [null, false]}
        };
        if (uuids.length > 0) {
            selector._id = {$nin: uuids}
        }
        let journals = Wb_meterReadingJournal.aggregate([
            {
                $match: selector
            },
            {
                $lookup: {
                    from: 'wb_metersReading',
                    localField: 'meterReadingId',
                    foreignField: '_id',
                    as: 'meterReadingDoc'
                }
            },
            {
                $unwind: {
                    path: '$meterReadingDoc', preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    lastSynced: 1,
                    journalPostedCount: 1,
                    journalDetailCount: 1,
                    rolesArea: 1,
                    name: 1,
                    meterReadingDoc: 1,
                    isLocked: {$ifNull: ['$isLocked', false]}
                }
            },
            {$match: {'meterReadingDoc.assignUser': {$in: [userId.trim()]}}}
        ]);
        return journals;
    }

    //lookup journal book detail
    static lookupJournalDetails(meterReadingJournalId) {
        return WB_MeterReadingJournalDetail.aggregate([
            {
                $match: {meterReadingJournalId: meterReadingJournalId},
            },

            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {
                $unwind: {
                    path: '$customerDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'block',
                    foreignField: '_id',
                    as: 'customerDoc.blockDoc'
                }
            },
            {
                $unwind: {
                    path: '$customerDoc.blockDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    customerDoc: {
                        _id: 1,
                        blockDoc: 1,
                        streetNo: {$ifNull: ["$streetNo", "$customerDoc.streetNo"]},
                        dpc: {$ifNull: ["$dpc", "$customerDoc.dpc"]},
                        khName: 1,
                        avgWaterConsumption: 1,
                        name: 1
                    },
                    desc: 1,
                    meterChangeDesc: 1,
                    newReading: 1,
                    waterConsumption: 1,
                    prevReading: 1,
                    avgWaterConsumption: {$ifNull: ['$customerDoc.avgWaterConsumption', 0]},
                    meterReadingJournalId: 1,
                    newReadingDate: 1,
                    prevReadingDate: 1,
                    lastSynced: 1,
                    lastModified: 1
                }
            },
            {
                $unwind: {path: '$avgWaterConsumption', preserveNullAndEmptyArrays: true}
            }
        ]);
    }

    //update synced
    static updateJournalBooksLastSynced(uuids, lastSynced, userId) {
        return Wb_meterReadingJournal.direct.update({_id: {$in: uuids}}, {
            $addToSet: {syncedBy: userId},
            $set: {lastSynced: lastSynced}
        });
    }

    static updateSyncedByInJournalDetailAfterSynced(uuids, lastSynced, userId) {
        return WB_MeterReadingJournalDetail.direct.update({_id: {$in: uuids}}, {
            $addToSet: {syncedBy: userId},
            $set: {lastSynced: lastSynced}
        });
    }

    //push journal detail to server
    static syncJournalDetailToServer(journalId, journalDetails, userId) {
        let journalBook = Wb_meterReadingJournal.findOne({_id: journalId});
        let mapCustomers = journalDetails.map(o => o.customerDoc._id);
        let customersArr = WB_Customer.find({_id: {$in: mapCustomers}}).fetch();
        let journalDetailIds = [];
        let meterReadingId = '';
        let bypassPrinted = false;
        journalDetails.forEach(function (journalDetail) {
            journalDetailIds.push(journalDetail.uuid);
            if (journalDetailIds.length === 1) { //lookup journal book one time only
                let journalDoc = Wb_meterReadingJournal.findOne({_id: journalId});
                meterReadingId = journalDoc.meterReadingId;
            }
            journalDetail._id = journalDetail.uuid;
            journalDetail.customerId = journalDetail.customerDoc._id;
            journalDetail.newReading = parseInt(journalDetail.newReading);
            journalDetail.newReading = journalDetail.newReading === 0 && journalDetail.desc ? journalDetail.prevReading : journalDetail.newReading
            journalDetail.newReadingDate = moment(journalBook.date).toDate();
            journalDetail.meterReadingId = meterReadingId || '';
            bypassPrinted = journalDetail.bypassPrinted || false;
            let waterConsumption = journalDetail.newReading - journalDetail.prevReading;
            if (waterConsumption >= 0) {
                //true params at the end use for check is mobile device syncing
                UploadJBD.getTariffForUpload(waterConsumption, journalDetail, customersArr, userId, true);
            }
        });
        if (journalDetailIds.length > 0 && !bypassPrinted) {
            let journalDetailId = journalDetailIds[0]; // get one of exist journal detail
            let journalDetail = journalDetails.find(o => o.uuid === journalDetailId);
            let journalDoc = Wb_meterReadingJournal.findOne({_id: journalId});
            let doc = {
                date: moment(journalDetail.lastSynced).toDate(),
                dateStr: journalDetail.lastSynced,
                journalBookId: journalId,
                userId,
                meterReadingId: journalDoc.meterReadingId,
                journalDate: moment(journalDoc.date).format('YYYY-MM-DD')
            };
            Meteor.call('mobileSync_insert', doc);
        }
    }

    //lookup journal book doc
    static lookupJournalBookDoc(selector) {
        if (!selector) {
            return;
        }
        return Wb_meterReadingJournal.findOne(selector);
    }

    //fetch description
    static fetchDescription(selector = {}) {
        return Description.find(selector).fetch();
    }

    //lookup journal detail history with the previous 3 months only
    static lookupJournalDetailHistoryByCustomerId(uuid, customerId) {
        return WB_MeterReadingJournalDetail.aggregate([
            {
                $sort: {newReadingDate: 1}
            },
            {
                $limit: 3
            },
            {
                $match: {_id: {$nin: [uuid]}, customerId: customerId}
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
            {
                $project: {
                    _id: 1,
                    customerDoc: {
                        _id: 1,
                        blockDoc: 1,
                        streetNo: 1,
                        dpc: 1,
                        khName: 1,
                        avgWaterConsumption: 1,
                        name: 1
                    },
                    desc: 1,
                    meterChangeDesc: 1,
                    newReading: 1,
                    waterConsumption: 1,
                    prevReading: 1,
                    avgWaterConsumption: {$ifNull: ['$customerDoc.avgWaterConsumption', 0]},
                    meterReadingJournalId: 1,
                    newReadingDate: 1,
                    prevReadingDate: 1,
                    lastSynced: 1,

                }
            },
        ]);
    }

    //creditor
    static creditorJournalBook(userId, rolesArea, cond) {
        let condSelector = !cond ? {$and: [{$eq: ['$$item.status', 'active']}, {$eq: [{$type: "$$item.closedAt"}, 'missing']}]} : cond;
        let selector = {
            rolesArea: {$in: rolesArea},
            assignUser: {$in: [userId]}
        };
        return WB_MetersReading.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: 'wb_requestCuttingWater',
                    localField: 'blockId',
                    foreignField: 'blockId',
                    as: 'requestCuttingWaterArr'
                }
            },
            {
                $project: {
                    count: {
                        $size: {
                            $filter: {
                                input: '$requestCuttingWaterArr',
                                as: 'item',
                                cond: condSelector
                            }
                        }
                    },
                    _id: 1,
                    name: 1,
                    blockId: 1
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
                    as: 'quartierDoc'
                }
            },
            {
                $unwind: {
                    path: '$quartierDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
              $lookup: {
                  from: 'wb_district',
                  localField: 'quartierDoc.districtCodeId',
                  foreignField: '_id',
                  as: 'districtDoc'
              }
            },
            {
              $unwind: {
                  path: '$districtDoc',
                  preserveNullAndEmptyArrays: true
              }
            },
            {
                $group: {
                    _id: '$quartierDoc._id',
                    code: {$last: {$concat: ['$districtDoc.code', '$quartierDoc.code']}},
                    name: {$last: '$quartierDoc.name'},
                    count: {$sum: '$count'},
                    blocks: {
                        $push: '$$ROOT'
                    }
                }
            }
        ])
    }
}
