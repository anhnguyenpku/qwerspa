import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {WB_MetersReading} from '../../../imports/collection/meterReading';
import {WB_Block} from '../../../imports/collection/block';
import {WB_Quartier} from '../../../imports/collection/quartier';

Meteor.methods({
    isDistrictHasRelation: function (id) {
        let anyRelatedData=
            WB_Customer.findOne({district: id})
            || WB_Quartier.findOne({districtCodeId: id})
            || WB_Block.findOne({districtCode: id})
            || WB_MetersReading.findOne({districtId:id});
        return !!anyRelatedData;
    }
});
