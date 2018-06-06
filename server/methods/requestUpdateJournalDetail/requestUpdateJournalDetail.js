import RequestUpdateJournalDetailModel from '../../../imports/api/methods/requestJournalDetail'

Meteor.methods({
    requestUpdateJournalDetail_insert(userId, meterReadingId, doc) {
        return RequestUpdateJournalDetailModel.insert(userId, meterReadingId, doc);
    },
    requestUpdateJournalDetail_update(_id,selector) {
        return RequestUpdateJournalDetailModel.update(_id, selector);
    }
});