/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const WB_Benchmarking = new Mongo.Collection("wb_benchmarking");

WB_Benchmarking.schema = new SimpleSchema({

    name: {
        type: String,
        label: "សូចនាករ"
    },
    des: {
        type: String,
    },
    unit: {
        type: String,
    },

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_Benchmarking.attachSchema(WB_Benchmarking.schema);
});


