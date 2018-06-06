import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_Block} from '../../../imports/collection/block';
import {WB_MetersReading} from '../../../imports/collection/meterReading';

Meteor.methods({
    isQuartierHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({quartier: id})
            || WB_Block.findOne({quartierId: id})
            || WB_MetersReading.findOne({quartierId:id});
        return !!anyRelatedData;
    }
});
