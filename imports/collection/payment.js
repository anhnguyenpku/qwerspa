/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const WB_Payment = new Mongo.Collection("wb_payment");

WB_Payment.schema = new SimpleSchema({
    dateFormatted:{
        type:String,
        label:"Date",
    },
    date: {
        type: Date,
        label: "Date",
    },
    meterJournalId: {
        type: String,
        label: "Inv No",
        index: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    rolesArea: {
        type: String,
    },
    mainTellerId:{
        type:String,
        optional:true
    },
    tellerId:{
        type:String,
        optional:true,
    },
    agentId:{
        type:String,
        optional:true
    },
    isAccept:{
        type:Boolean,
        autoValue(){
            if (this.isInsert) {
                return false;
            }
        },
    },
    dueAmount:{
        type:Number,
        label:"Amount Due",
        decimal:true,
    },
    paidAmount:{
        type:Number,
        label:"Paid Amount",
        decimal:true,
    },
    balance:{
        type:Number,
        label:"Balance",
        decimal:true,
    },
    withdrawSaving: {
        type: Number,
        decimal: true,
        optional: true
    },
    status:{
        type:String,
    },
    createdAt: {
        type: Date,
        autoValue(){
            if(this.isInsert) {
                return moment().toDate();
            }
        }
    },
    createdBy: {
        type: String,
        optional: true
    },
    seqId: {
        type: String,
        optional: true,
        unique: true
    },
    type: {
        index: true,
        type: String
    },
    feeAmount:{
        type:Number,
        decimal:true,
        optional:true
    },
    penaltyAmount:{
        type:Number,
        decimal:true,
        optional:true
    },
    transferBy:{
        type: String,
        optional: true
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_Payment.attachSchema(WB_Payment.schema);
});


