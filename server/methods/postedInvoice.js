import {WB_Customer} from '../../imports/collection/customer';

Meteor.methods({
    countAvailableMeterReadingJournalDetail(selector) {
        return WB_Customer.find(selector).count()
    }
});