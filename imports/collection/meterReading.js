import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';


export const WB_MetersReading = new Mongo.Collection("wb_metersReading");
export const VW_metersReading = new Mongo.Collection("vw_metersReading");


WB_MetersReading.schema = new SimpleSchema({
    name: {
        type: String
    },
    billingPeriod: {
        type: Date,
        label: "Billing Period",
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: {
                autoclose: true
            }
        },
        optional:true
    },
    customerTypeId: {
        type: String,
        label: "Customer Type",
        optional:true
    },
    districtId: {
        type: String,
        label: "District",
        optional:true
    },
    quartierId: {
        type: String,
        label: "Quartier",
        optional:true,
    },
    blockId: {
        type: String,
        label: "Block",
        optional:true
    },
    categoryId: {
        type: String,
        label: "Category",
        optional:true
    },
    activityId: {
        type: String,
        optional: true,
        autoform: {
            type: 'select2'
        }
    },
    classId: {
        type: String,
        label: "Class",
        optional:true
    },
    position: {
        type: String,
        label: "Position",
        autoform: {
            type: 'select2',
            options(){
                return [
                    {label: '(Please Choose)', value: ''},
                    {label: 'Active', value: 'active'},
                    {label: 'Inactive', value: 'inactive'},
                ];
            }
        },
        optional:true
    },
    operationCodeId: {
        type: String,
        label: "Operation Code",
        optional:true,
    },
    rolesArea: {
        type: String,
        optional: true
    },
    assignUser: {
        type: [String],
        label: "Assign User",
        autoform: {
            type: 'select2',
            multiple: true
        }
    }
});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_MetersReading.attachSchema(WB_MetersReading.schema);
});

