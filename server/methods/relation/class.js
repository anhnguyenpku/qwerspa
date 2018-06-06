import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isClassHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({class: id})
            || WB_MetersReading.findOne({classId:id});
        return !!anyRelatedData;
    }
});
