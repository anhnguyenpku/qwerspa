import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer';

Meteor.methods({
    isTariffHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({tariff: id});
        return !!anyRelatedData;
    }
});
