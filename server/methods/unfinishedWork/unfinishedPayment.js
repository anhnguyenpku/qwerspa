import {unfinishedPayment} from '../../../imports/collection/unfinshed-work';
import Saving from '../../../imports/api/methods/saving';

Meteor.methods({
    fetchUnfinishedPayment({createdBy, rolesArea}) {
        let unfinishedPayments = unfinishedPayment.aggregate([
            {$match: {createdBy, rolesArea}},
            {
                $lookup: {
                    from: 'wb_meterReadingJournalDetails',
                    localField: 'meterJournalId',
                    foreignField: '_id',
                    as: 'journalBookDoc'
                }
            },
            {
                $unwind: {
                    path: '$journalBookDoc',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {'journalBookDoc.balance': {$gt: 0}, 'journalBookDoc.paymentStatus': {$eq: 'active'}}
            }
        ]);
        unfinishedPayments.forEach(function (doc) {
            let saving = Saving.giveMeSavingObject({customerId: doc.customerId});
            doc.savingBalance = saving && saving.balance || doc.savingBalance;
        });
        return unfinishedPayments;
    },
    removeCurrentWorkPayment({selector}) {
        unfinishedPayment.remove(selector);
    }
});