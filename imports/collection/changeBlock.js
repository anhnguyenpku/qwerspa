/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const WB_ChangeBlock = new Mongo.Collection("wb_changeBlock");

WB_ChangeBlock.schema = new SimpleSchema({
    customerId: {
        type: String,
        index: true,
        /*autoform: {
         type: "select2",
         }*/
    },
    customerDistrict:{
        type: String,
        label:"District",
        index: true
    },
    customerQuartier:{
        type: String,
        label:"Quartier",
        index: true
    },
    customerBlock: {
        type: String,
        label:"Block",

        index: true
    },
    customerFolio: {
        type: String,
        label:"Folio",

        index: true
    },
    customerSuccessor: {
        type: String,
        label:"Successor",

        index: true
    },
    customerStreet: {
        type: String,
        label:"Street",

        index: true
    },
    customerDPC: {
        type: String,
        label:"DPC",
        index: true
    },
    newDPC: {
        type:String,
        optional:true,
        label:"New DPC",
        index: true
    },
    newDistrict:{
        type: String,
        label:"New District",
        index: true
    },
    newQuartier:{
        type: String,
        label:"New Quartier",
        index: true
    },
    newFolio:{
        type: String,
        label:"New Folio",
        min: 4,
        max: 4,
        index: true
    },
    newBlock: {
        type: String,
        label:"New Block",

        index: true
    },
    newSuccessor:{
        type: String,
        label:"New Successor",
        index: true,
        min: 1,
        max: 1
    },
    newStreet:{
        type: String,
        label:"New Street",
        index: true
    },
    changeDate: {
        type:Date,
        label:"Change Date",
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    autoclose: true
                }
            }
        }
    },
    endDate: {
        type:Date,
        label:"Change Date",
        optional:true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    autoclose: true
                }
            }
        }
    },
    rolesArea: {
        type: String,
        optional: true
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_ChangeBlock.attachSchema(WB_ChangeBlock.schema);
});


