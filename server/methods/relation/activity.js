import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isActivityHasRelation: function (id) {
        let anyRelatedData =
            WB_Customer.findOne({activity: id})
            || WB_MetersReading.findOne({activityId: id});
        return !!anyRelatedData;
    }
});
