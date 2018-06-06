/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const WB_Agent = new Mongo.Collection("wb_agent");

WB_Agent.schema = new SimpleSchema({

    phone: {
        type: String,
        label: "Phone",
        optional: true
    },
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    rolesArea: {
        type: String
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_Agent.attachSchema(WB_Agent.schema);
});


