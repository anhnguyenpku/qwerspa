import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isBlockHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({block: id})
            || WB_MetersReading.findOne({blockId:id});
        return !!anyRelatedData;
    }
});
