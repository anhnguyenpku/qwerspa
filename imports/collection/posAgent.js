/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const Pos_Agent = new Mongo.Collection("pos_agent");

Pos_Agent.schema = new SimpleSchema({
    phoneNumber: {
        type: String,
        label: "Phone",
        optional: true
    },
    name: {
        type: String,
        label: "Name"
    },
    address: {
        type: String,
        label: "Address"
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    transactionNumber: {
        type: Number,
        label: "Transaction Number",
        optional: true
    },
    rolesArea: {
        type: String
    },
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return moment().toDate();
            }
        }
    },
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return Meteor.userId();
            }
        }
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    Pos_Agent.attachSchema(Pos_Agent.schema);
});


