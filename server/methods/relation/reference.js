import {Meteor} from 'meteor/meteor';
import {WB_Tariff} from '../../../imports/collection/tariff';

Meteor.methods({
    isReferenceHasRelation: function (id) {
        let anyRelatedData=
           WB_Tariff.findOne({typeId: id})
            || WB_Tariff.findOne({measureId:id})
            || WB_Tariff.findOne({floorBy:id});
        return !!anyRelatedData;
    }
});
