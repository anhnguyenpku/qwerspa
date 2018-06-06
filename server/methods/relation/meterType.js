import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';

Meteor.methods({
    isMeterTypeHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({'contract.meterTypeId': id});
        return !!anyRelatedData;
    }
});
