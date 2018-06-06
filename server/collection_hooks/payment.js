import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';
import {WB_Payment} from '../../imports/collection/payment.js';
import {WB_MeterReadingJournalDetail} from '../../imports/collection/meterReadingJournal.js';
import {WB_RequestCuttingWater} from '../../imports/collection/requestCuttingWater.js';
import Trans from "../../imports/api/methods/transaction";
import Saving from "../../imports/api/methods/saving";
import moment from 'moment';

WB_Payment.before.insert(function (userId, doc) {
    // doc._id = GeneralFunction.generatePrefixId(WB_Payment, doc.meterJournalId, 3);
});

WB_Payment.after.insert(function (userId, doc) {
    let seqId = GeneralFunction.generatePrefixIdWithCounter('receivePayment', doc.rolesArea, doc.meterJournalId, 3);
    let selector = {};
    let meterJournalDetail = WB_MeterReadingJournalDetail.findOne({_id: doc.meterJournalId});
    let paymentDate = moment(doc.date);
    let correctDate = doc.date;
    let newReadingDate = moment(meterJournalDetail.newReadingDate).format('YYYY-MM-DD');
    if (doc.status == 'closed') {
        selector.$set = {
            balance: doc.balance,
            paymentStatus: 'closed',
            closedAt: doc.date
        }
        if (doc.type === 'expired') {
            selector.$set.isExpired = true;
            selector.$set.closedExpiredAt = paymentDate.isBefore(newReadingDate) ? moment().toDate : doc.date;
        }
    } else {
        selector.$set = {
            paymentStatus: 'partial',
            balance: doc.balance,
        };
        if (doc.type === 'expired') {
            selector.$set.isExpired = true;
        }
    }
    if (paymentDate.isBefore(newReadingDate)) {
        correctDate = meterJournalDetail.newReadingDate;
        WB_Payment.direct.update({_id: doc._id}, {
            $set: {
                dateFormatted: moment().format('YYYY-MM-DD'),
                date: moment().toDate()
            }
        });
    }
    WB_MeterReadingJournalDetail.direct.update(doc.meterJournalId, selector);
    WB_Payment.direct.update({_id: doc._id}, {$set: {seqId: seqId}});
    Meteor.defer(function () {
        let setSelector = {$set: {status: doc.status}};
        let pipelines = [
            {$match: {_id: doc.meterJournalId}},
            {
                $lookup: {
                    from: 'wb_requestCuttingWater',
                    localField: 'requestCuttingWaterId',
                    foreignField: '_id',
                    as: 'requestCuttingWaterDoc'
                }
            },
            {
                $unwind: {path: '$requestCuttingWaterDoc', preserveNullAndEmptyArrays: true}
            }
        ];
        WB_MeterReadingJournalDetail.aggregate(pipelines)
            .map(o => {
                let data = {
                    customerId: o.customerId,
                    amount: -(doc.paidAmount + doc.withdrawSaving),
                    refId: doc._id,
                    date: correctDate
                };
                //update meter journal detail
                WB_MeterReadingJournalDetail.direct.update({
                    customerId: o.customerId,
                    newReadingDate: {$gt: o.newReadingDate},
                    rolesArea: o.rolesArea,
                }, {$inc: {oldBalance: -doc.paidAmount}}, {multi: true});
                if (doc.status === 'closed') {
                    setSelector.$set.closingAt = doc.date;
                }
                //update withdrawing
                if (doc.withdrawSaving > 0) {
                    let data = {
                        type: 'withdraw',
                        amount: -doc.withdrawSaving,
                        insertFrom: 'payment',
                        refFrom: doc._id,
                        description: "Withdrawing by payment " + doc.withdrawSaving,
                        customerId: o.customerId,
                        date: correctDate,
                        createdBy: doc.createdBy
                    };
                    Saving.insert({doc: data});
                }
                //update request cutting water doc
                if (o.requestCuttingWaterDoc) {
                    let selector = {$set: {paidAt: doc.date, status: 'closed'}};
                    if (o.requestCuttingWaterDoc.closedAt) {
                        selector.$set.requestedOpen = true;
                    }
                    WB_RequestCuttingWater.update({_id: o.requestCuttingWaterDoc._id}, selector);
                }
                Trans.insertTransaction({status: doc.status, type: 'payment', data, rolesArea: doc.rolesArea})
                Trans.directUpdateTransactionDetail({refId: doc.meterJournalId}, setSelector);
            });
    });

});

WB_Payment.after.remove(function (userId, doc) {
    let payments = WB_Payment.find({meterJournalId: doc.meterJournalId});
    let selector = {
        $set: {paymentStatus: 'active'},
        $unset: {closedAt: ''},
        $inc: {balance: doc.paidAmount + doc.withdrawSaving}
    };
    if (payments.count() == 0) {
        selector.$set.isExpired = false;
        selector.$unset.closedExpiredAt = '';
        WB_MeterReadingJournalDetail.direct.update(doc.meterJournalId, selector);
    } else {
        WB_Payment.direct.update({
            meterJournalId: doc.meterJournalId,
            _id: {$ne: doc._id},
            $or: [
                {date: {$gt: doc.date}},
                {dueAmount: {$lt: doc.dueAmount}}
            ]
        }, {
            $inc: {dueAmount: doc.paidAmount + doc.withdrawSaving, balance: doc.paidAmount + doc.withdrawSaving},
            $set: {status: 'partial'}
        }, {multi: true});
        selector.$set.paymentStatus = 'partial';
        selector.$unset.closedAt = '';
        selector.$unset.closedExpiredAt = '';
        WB_MeterReadingJournalDetail.direct.update(doc.meterJournalId, selector);
    }
    Meteor.defer(function () {
        let meterReadingJournalDetail = WB_MeterReadingJournalDetail.findOne({_id: doc.meterJournalId});
        WB_MeterReadingJournalDetail.direct.update({
            customerId: meterReadingJournalDetail.customerId,
            newReadingDate: {$gt: meterReadingJournalDetail.newReadingDate},
            rolesArea: meterReadingJournalDetail.rolesArea,
        }, {$inc: {oldBalance: doc.paidAmount}}, {multi: true});

        let setSelector = {$unset: {closingAt: ''}, $set: {status: 'active'}};
        Saving.removingSaleDetail({refFrom: doc._id});
        Trans.removeTransactionDetail({refId: doc._id});
        Trans.directUpdateTransactionDetail({refId: doc.meterJournalId}, setSelector);

    });
});