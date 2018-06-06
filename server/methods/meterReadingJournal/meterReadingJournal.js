import {Meteor} from 'meteor/meteor';
import {Wb_meterReadingJournal, WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal';
import {WB_MetersReading} from '../../../imports/collection/meterReading';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {TransactionDetail} from '../../../imports/collection/transaction.js';
//validate user function
import ValidateUser from '../../../both/validateMethods/validate-user';
import {CheckRoles} from "../../../imports/api/methods/checkRoles";
import MRJDFunc from '../../../imports/api/methods/meterReadingJournalDetail';

Meteor.methods({
    checkIfMeterReadingJournalDetailCanModify({_id, prevReadingDate, customerId, rolesArea}) {
        return MRJDFunc.checkIfMeterReadingJournalDetailCanModify({_id, prevReadingDate, customerId, rolesArea})
    },
    addNewMeterReadingJournal({meterReadingJournal}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        let startDate = moment(meterReadingJournal.validateDate).startOf('month').toDate();
        let endDate = moment(meterReadingJournal.validateDate).endOf('month').toDate();
        let existJournalBook = Wb_meterReadingJournal.findOne(
            {
                rolesArea: meterReadingJournal.rolesArea,
                meterReadingId: meterReadingJournal.meterReadingId,
                $or: [
                    {validateDate: {$gte: startDate, $lte: endDate}},
                    {validateDate: {$gte: endDate}}
                ]
            }
        );
        if (existJournalBook) {
            throw new Meteor.Error('Cant create journal book. Please check your date');
        }
        let id = Wb_meterReadingJournal.insert(meterReadingJournal, function (err) {
            if (err) {
                // console.log(err);
            }
        });
        return id;
    },
    removeMeterReadingJournalDetail(id) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        MRJDFunc.removeMeterReadingJournalDetail({_id: id});
    },
    removeMeterReadingJournal({_id}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to remove reading journal'});
        let meterReadingJournalDetail = WB_MeterReadingJournalDetail.find({written: true, meterReadingJournalId: _id});

        if (meterReadingJournalDetail.count() > 0) {
            throw new Meteor.Error("មិនអាចលុបបាន មានទិន្នន័យនៅក្នុងសៀវភៅអានលេខ");
        } else {
            Wb_meterReadingJournal.remove({_id: _id});
            WB_MeterReadingJournalDetail.remove({meterReadingJournalId: _id});
        }
    },
    updateMeterReadingJournal({meterReadingJournal}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to edit meterReadingJournal setting!'});
        return Wb_meterReadingJournal.update(meterReadingJournal._id, {
            $set: {
                code: meterReadingJournal.code,
                name: meterReadingJournal.name
            }
        });
    },
    fetchMeterReadingJournal(selector) {
        Meteor._sleepForMs(200);
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal'});
        return Wb_meterReadingJournal.findOne(selector);
    },
    fetchMeterReadingJournalData() {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data'});
        let activities = Wb_meterReadingJournal.find({});
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        activities.forEach(function (meterReadingJournal) {
            list.push({
                label: `${meterReadingJournal.code} | ${meterReadingJournal.name}`,
                value: meterReadingJournal._id
            });
        });
        return list;
    },
    getCustomerByMeterReading(query) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        Meteor._sleepForMs(200);
        let meterReading = WB_MetersReading.findOne({_id: query.mrId});
        let meterReadingJournal = Wb_meterReadingJournal.findOne({_id: query.mrjId});
        if (meterReadingJournal) {
            if (meterReading && !query.id) {
                let reReading = eval(query.rr || 'false'); // set reReading to false if re-reading journal not exists


                let selector = {
                    position: {$eq: 'active'},
                    district: meterReading.districtId,
                    quartier: meterReading.quartierId,
                    block: meterReading.blockId,
                    // category: meterReading.categoryId,
                    contract: {$exists: true},
                    prevReadingDate: {$lte: query.date}
                };
                // if(meterReading.position){
                //     selector.position=meterReading.position;
                // }
                // if(meterReading.districtId){
                //     selector.district=meterReading.districtId;
                // }
                // if(meterReading.quartierId){
                //     selector.quartier=meterReading.quartierId;
                // }
                // if(meterReading.blockId){
                //     selector.block=meterReading.blockId;
                // }
                // if(meterReading.categoryId){
                //     selector.category=meterReading.categoryId;
                // }
                // if(meterReading.operationCodeId){
                //     selector.operationCode=meterReading.operationCodeId;
                // }

                if (reReading) {
                    let customer = [];
                    let journalDetail = WB_MeterReadingJournalDetail.find({meterReadingJournalId: query.mrjId});
                    journalDetail.forEach(function (doc) {
                        customer.push(doc.customerId);
                    });
                    selector._id = {$nin: customer};
                }
                let customers = WB_Customer.aggregate(
                    [
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
                                from: 'wb_meterType',
                                localField: 'contract.meterTypeId',
                                foreignField: '_id',
                                as: 'meterTypeDoc'
                            }
                        },
                        {$unwind: {path: '$categoryDoc', preserveNullAndEmptyArrays: true}},
                        {$unwind: {path: '$classDoc', preserveNullAndEmptyArrays: true}},
                        {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
                        {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
                        {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
                        {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}}
                    ]
                );
                return {reading: false, data: customers}
            }
        } else {
            throw new Meteor.Error('This reading book is already created!')
        }
        return {reading: false, data: []};

    },
    insertPreviewMeterReadingJournal({meterReadingJournalId, meterReadingId, rolesArea, previewMeterReadingJournal}) {
        Meteor._sleepForMs(250);
        ValidateUser.ifUserNotSignedIn({msg: 'Must be login in order to insert preview meter reading journal'});
        if (CheckRoles({roles: ['setting', 'super', 'write']})) {
            let meterReadingJournalDoc = Wb_meterReadingJournal.findOne({_id: meterReadingJournalId});
            if (previewMeterReadingJournal.length > 0) {
                previewMeterReadingJournal.forEach(function (doc) {
                    doc.prevReading = doc.prevReading || doc.contract && doc.contract.prevReading || 0;
                    doc.prevReadingDate = doc.prevReadingDate || doc.contract && doc.contract.prevReadingDate;
                    doc.customerId = doc._id;
                    doc.meterReadingJournalId = meterReadingJournalId;
                    doc.rolesArea = rolesArea;
                    WB_MeterReadingJournalDetail.insert(doc);
                });
                Wb_meterReadingJournal.direct.update(meterReadingJournalId, {$inc: {journalDetailCount: previewMeterReadingJournal.length}});
            }

        } else {
            throw new Meteor.Error('You have no rights',
                'to save this Meter Reading Journal');
        }
    },
    applySelectedDateToMeterReadingJournalDetail(meterReadingJournalDetailIds, customerIds, selectedDate) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in order to do this operation'});
        WB_MeterReadingJournalDetail.direct.update(
            {
                _id: {$in: meterReadingJournalDetailIds}
            },
            {
                $set: {
                    newReadingDate: selectedDate,
                    updatedAt: selectedDate,
                    updatedBy: Meteor.userId()
                }
            }, {multi: true}, function (err) {
                if (!err) {
                    TransactionDetail.direct.update({refId: {$in: meterReadingJournalDetailIds}}, {
                        $set: {
                            date: selectedDate,
                            updatedAt: selectedDate
                        }
                    }, {multi: true});
                    WB_Customer.direct.update({_id: {$in: customerIds}}, {$set: {prevReadingDate: selectedDate}}, {multi: true});
                } else {
                    throw new Meteor.Error(err);
                }
            });
        return;
    },
    getMeterReadingJournalDetailById(id, meterReadingJournalDetailId, assignedUser, filter) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        // let isPermiited = CheckRoles({roles: ['super', 'admin']});
        // if (!assignedUser) { //return if no assigned user passed in
        //     return;
        // }
        let selector = {};
        let filterSelector = {};
        filterSelector[filter] = 1;
        if (filter === 'waterConsumption') {
            filterSelector[filter] = -1;
        }
        // if (assignedUser.length > 0 && !isPermiited) { //check if is not admin
        //     selector.assignedUsers = {$in: assignedUser};
        // }
        if (meterReadingJournalDetailId) {
            selector._id = meterReadingJournalDetailId;
        } else {
            selector.meterReadingJournalId = id;
        }
        let meterReadingJournalDetails = WB_MeterReadingJournalDetail.aggregate([
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
                $project: {
                    "categoryDoc": 1,
                    "customerDoc": 1,
                    "classDoc": 1,
                    "districtDoc": 1,
                    "quartierDoc": 1,
                    "blockDoc": 1,
                    "meterTypeDoc":1,
                    "streetNo": {$ifNull:["$streetNo", "$customerDoc.streetNo"]},
                    "dpc": {$ifNull:["$dpc", "$customerDoc.dpc"]},
                    "khName": '$customerDoc.khName',
                    "_id": 1,
                    "assignedUsers" : 1,
                    "balance" : 1,
                    "barcode" : 1,
                    "billingCycle" :1,
                    "block" : 1,
                    "category" : 1,
                    "closedAt" : 1,
                    "contributionFee" :1,
                    "contributionFeePrice" :1,
                    "createdAt" : 1,
                    "createdBy" : 1,
                    "customerId" : 1,
                    "district" : 1,
                    "grandTotal" : 1,
                    "hasOldMeterWaterConsumption" : 1,
                    "isEstimated" : 1,
                    "isExpired" : 1,
                    "level" : 1,
                    "maintenanceFee" :1,
                    "maintenanceFeePrice" :1,
                    "meterReadingJournalId" :1,
                    "modifiedLevel" : 1,
                    "modifyTime" : 1,
                    "newReading" : 1,
                    "newReadingDate" : 1,
                    "oldBalance" :1,
                    "paymentStatus" : 1,
                    "position" : 1,
                    "prevReading" : 1,
                    "prevReadingDate" :1,
                    "price" : 1,
                    "priceList" : 1,
                    "printed" : 1,
                    "printedCount" :1,
                    "quantity" : 1,
                    "quartier" :1,
                    "rolesArea" : 1,
                    "saveWritten" : 1,
                    "tariff" : 1,
                    "total" : 1,
                    "updatedAt" : 1,
                    "updatedBy" :1,
                    "waterConsumption" :1,
                    "written" : 1,
                    "desc": 1,
                    "meterChangeDesc": 1,
                    "sumBarcode": 1
                }
            },
            {
                $sort: filterSelector
            },
        ]);
        return {reading: true, data: meterReadingJournalDetails}

    },
    countMeterReadingJournal(selector = {}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        let qSelector = selector;
        if (selector.$regex) {
            let query = new RegExp(selector.$regex, 'i');
            qSelector = {};
            qSelector.$or = [
                {
                    meterReadingId: {$regex: query}
                },
                {
                    name: {$regex: query}
                }
            ]
        }
        if (_.isEmpty(selector)) {
            return Wb_meterReadingJournal.find({}).count();
        }
        return Wb_meterReadingJournal.find(qSelector).count();
    },
    fetchWBMeterReadingJournal(selector = {}, options = {limit: 10, skip: 10}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        options.sort = {date: -1};
        let qSelector = selector;
        let isPermitted = CheckRoles({roles: ['super', 'admin']});
        let meterReadingSelector = {}; //check is permitted user
        if (!isPermitted) {
            meterReadingSelector['meterReadingDoc.assignUser'] = {$in: [Meteor.userId()]}
        }
        // let meterReadingJournals = Wb_meterReadingJournal.find(qSelector, options).fetch();
        let meterReadingJournals = Wb_meterReadingJournal.aggregate([
            {$match: selector},
            {
                $skip: options.skip
            },
            {
                $limit: options.limit
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
                $unwind: {path: '$meterReadingDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $match: meterReadingSelector
            }
        ]);
        return meterReadingJournals;
    },
    checkIfMeterReadingJournalNotExist({meterReadingJournalId}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        if (Meteor.userId()) {
            let notExist = false;
            let meterReadingJournal = Wb_meterReadingJournal.findOne({_id: meterReadingJournalId});
            let meterReadingJournalDetail = WB_MeterReadingJournalDetail.find({meterReadingJournalId: meterReadingJournalId});
            if (meterReadingJournalDetail.count() <= 0) {
                notExist = true;
            }
            return {
                notExist, meterReadingJournal
            }
        }
    },
    fineOneMeterReadingJournalDetail({_id}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        let isPermitted = CheckRoles({roles: ['admin', 'super']});
        let meterReadingSelector = {};
        if (!isPermitted) {
            meterReadingSelector.assignUser = {
                $in: [Meteor.userId]
            }
        }
        let journalDetail = WB_MeterReadingJournalDetail.aggregate([
            {
                $match: {_id}
            },
            {
                $lookup: {
                    from: 'wb_meterReadingJournal',
                    localField: 'meterReadingJournalId',
                    foreignField: '_id',
                    as: 'meterReadingJournalDoc'
                }
            },
            {
                $unwind: {
                    path: '$meterReadingJournalDoc',
                    preserveNullAndEmptyArrays: true
                }
            },


        ]);

        if (journalDetail.length > 0) {
            let journalDetailObj = journalDetail[0];
            meterReadingSelector._id = journalDetailObj.meterReadingJournalDoc && journalDetailObj.meterReadingJournalDoc.meterReadingId;
            let meterReading = WB_MetersReading.findOne(meterReadingSelector);
            if (!meterReading) {
                return;
            }
            return journalDetailObj;
        }
        return;
    },
    fetchPostedMeterReadingJournalDetailById({selector, skip, limit}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query meter reading journal data by customer'});
        let meterReadingJournals = WB_MeterReadingJournalDetail.aggregate([

            {
                $match: selector
            },

            {
                $lookup: {
                    from: 'wb_customer',
                    foreignField: '_id',
                    localField: 'customerId',
                    as: 'customerDoc'
                }
            },
            {
                $unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $sort: {'streetNo': 1}
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'wb_tariff',
                    localField: 'customerDoc.tariff',
                    foreignField: '_id',
                    as: 'customerDoc.tariffDoc'
                }
            },
            {
                $lookup: {
                    from: 'wb_category',
                    localField: 'customerDoc.category',
                    foreignField: '_id',
                    as: 'customerDoc.categoryDoc'
                }
            },
            {
                $unwind: {path: '$customerDoc.tariffDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $unwind: {path: '$customerDoc.categoryDoc', preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "wb_meterType",
                    localField: 'customerDoc.contract.meterTypeId',
                    foreignField: '_id',
                    as: 'customerDoc.contract.meterTypeDoc'
                }
            },
            {
                $unwind: {
                    path: '$customerDoc.contract.meterTypeDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            /*{
                $lookup: {
                    from: 'wb_transaction',
                    localField: 'customerId',
                    foreignField: 'customerId',
                    as: 'customerDoc.transaction'
                }
            },*/
            {
                $lookup: {
                    from: 'wb_waterBillingSetup',
                    localField: 'rolesArea',
                    foreignField: 'rolesArea',
                    as: 'waterBillingDoc'
                }
            },
            {
                $unwind: {path: '$waterBillingDoc', preserveNullAndEmptyArrays: true}
            },
            /*{
                $unwind: '$customerDoc.transaction'
            },*/


        ]);
        Meteor.defer(function () {
            meterReadingJournals.forEach(function (meterReadingJournal) {
                WB_MeterReadingJournalDetail.direct.update({_id: meterReadingJournal._id}, {
                    $set: {printed: true},
                    $inc: {printedCount: 1}
                })
            });
        });
        return meterReadingJournals;
    },
    updateNewReadingDateIsAvailabled(meterReadingJournalId, currentDate) {
        let currentJournalBook = Wb_meterReadingJournal.findOne({_id: meterReadingJournalId});
        return Wb_meterReadingJournal.findOne({
            meterReadingId: currentJournalBook.meterReadingId,
            date: {$gt: currentDate}
        });
    },
    updateMeterReadingJournalName(_id, selector) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to update meter reading journal data by customer'});
        return Wb_meterReadingJournal.update({_id: _id}, selector);
    },
    journalBook_toggleLock(_id,selector) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to update meter reading journal data by customer'});
        return Wb_meterReadingJournal.update({_id: _id}, selector);
    }
});