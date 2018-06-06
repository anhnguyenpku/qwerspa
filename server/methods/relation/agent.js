import {Meteor} from 'meteor/meteor';
import {WB_Payment} from '../../../imports/collection/payment';

Meteor.methods({
    isAgentHasRelation: function (id) {
        let anyRelatedData = WB_Payment.findOne({agentId: id});
        return !!anyRelatedData;
    }
});
