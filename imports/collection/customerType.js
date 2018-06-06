/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';



export const WB_CustomerType=new Mongo.Collection("wb_customerType");

WB_CustomerType.schema = new SimpleSchema({

    code: {
        type: String,
        label: "Code"
    },
    description: {
        type: String,
        label: "Description"
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_CustomerType.attachSchema(WB_CustomerType.schema);
});


