import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';

Meteor.methods({
    isMeterCodeHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({'contract.meterCode': id});
        return !!anyRelatedData;
    }
});
