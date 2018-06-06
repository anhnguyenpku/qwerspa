import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_Tariff} from '../../../imports/collection/tariff.js';
import {WB_Class} from '../../../imports/collection/class';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isCategoryHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({category: id})
            || WB_Tariff.findOne({categoryId: id})
            || WB_Class.findOne({categoryId:id})
            || WB_MetersReading.findOne({categoryId:id});
        return !!anyRelatedData;
    }
});
