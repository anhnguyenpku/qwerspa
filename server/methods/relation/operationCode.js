import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isOperationCodeHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({operationCode: id})
            || WB_MetersReading.findOne({operationCodeId:id});
        return !!anyRelatedData;
    }
});
