import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';
import Trans from '../../imports/api/methods/transaction';
import {WB_Customer} from '../../imports/collection/customer';
import MRJDFunc from '../../imports/api/methods/meterReadingJournalDetail';


// Collection
import {Wb_meterReadingJournal, WB_MeterReadingJournalDetail} from '../../imports/collection/meterReadingJournal';
import {WB_waterBillingSetup} from '../../imports/collection/waterBillingSetup';
import {WB_MetersReading} from '../../imports/collection/meterReading';

Wb_meterReadingJournal.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generatePrefixId(Wb_meterReadingJournal, doc.rolesArea, 11);
});
WB_MeterReadingJournalDetail.before.insert(function (userId, doc) {
    let meteorReadingJournal = Wb_meterReadingJournal.findOne({_id: doc.meterReadingJournalId});
    let yy = moment(meteorReadingJournal.date).format('YY');
    let mm = moment(meteorReadingJournal.date).format('MM');
    doc._id = GeneralFunction.generatePrefixIdWithCounter('meterReadingJournalDetail', doc.rolesArea, doc.rolesArea + '-' + `${yy}${mm}`, 5);
});

WB_MeterReadingJournalDetail.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let waterBillingSetup = WB_waterBillingSetup.findOne({});
        let company = waterBillingSetup ? waterBillingSetup[waterBillingSetup.waterBillingUsageShortName + 'Name'] : '';
        let barcode = doc._id.substr(5, doc._id.length);
        let journal = Wb_meterReadingJournal.findOne({_id: doc.meterReadingJournalId});
        let meterReading = WB_MetersReading.findOne({_id: journal.meterReadingId});
        WB_MeterReadingJournalDetail.direct.update({_id: doc._id}, {
            $set: {
                oldBalance: 0,
                barcode: barcode,
                assignedUsers: meterReading.assignUser
            }
        });

    });
});

WB_MeterReadingJournalDetail.after.update(function (userId, doc) {
    let preDoc = this.previous;
    Meteor.defer(function () {
        if (doc.written) {
            let data = {
                customerId: doc.customerId,
                amount: doc.grandTotal,
                refId: doc._id,
                date: doc.newReadingDate,
                waterConsumption: doc.waterConsumption
            };
            if (doc.modifyTime > 0) {
                preDoc.modifiedBy = preDoc.updatedBy;
                preDoc.action = 'edit';
                preDoc.type = 'meterReadingJournalDetail';
                MRJDFunc.insertRefModify(preDoc);
            }
            Trans.insertTransaction({status: 'active', type: 'post', data, rolesArea: doc.rolesArea});
            let meterReadingJournalDetails = WB_MeterReadingJournalDetail.find({
                customerId: doc.customerId,
                rolesArea: doc.rolesArea,
                newReadingDate: {$lt: doc.newReadingDate},
                balance: {$gt: 0},
                waterConsumption: {$gt: 0}
            });
            let oldBalance = 0;
            meterReadingJournalDetails.forEach((md) => {
                oldBalance += md.balance;
            });
            WB_MeterReadingJournalDetail.direct.update({_id: doc._id}, {$set: {oldBalance: oldBalance}});
            //check if previous document is not yet update. so increament journalPosted count by 1
            if (!preDoc.newReadingDate) {
                Wb_meterReadingJournal.direct.update({_id: doc.meterReadingJournalId}, {$inc: {journalPostedCount: 1}});
            }
        }
    });
});
WB_MeterReadingJournalDetail.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        if (doc.written) {
            let selector = {
                prevReadingDate: doc.prevReadingDate,
                prevReading: doc.prevReading,
                newReading: 0
            };
            Wb_meterReadingJournal.direct.update({_id: doc.meterReadingJournalId}, {
                $inc: {
                    journalPostedCount: -1,
                    journalDetailCount: -1
                }
            });
            WB_Customer.direct.update({_id: doc.customerId}, {$set: selector});
            Trans.removeTransactionDetail({refId: doc._id});
            doc.modifiedBy = userId;
            doc.action = 'remove';
            doc.type = 'meterReadingJournalDetail';
            MRJDFunc.insertRefModify(doc);
            if(doc.requestCuttingWaterId){
                Meteor.call('payment_removeCuttingWater', doc.requestCuttingWaterId);
            }
            //Won't happen...
            /*WB_MeterReadingJournalDetail.direct.update({
                customerId: doc.customerId,
                newReadingDate: {$gt: doc.newReadingDate},
                rolesArea: doc.rolesArea,
            }, {$inc: {oldBalance: -doc.balance}}, {multi: true});*/
        }
    });
});