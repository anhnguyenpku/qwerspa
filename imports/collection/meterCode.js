/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';



export const WB_MeterCode=new Mongo.Collection("wb_meterCode");

WB_MeterCode.schema = new SimpleSchema({

    code: {
        type: String,
        label: "Code"
    },
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description",
        optional:true
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_MeterCode.attachSchema(WB_MeterCode.schema);
});


