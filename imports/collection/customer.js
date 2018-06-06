/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';
import {WB_Reference} from '../collection/reference';
import {WB_MeterType} from '../collection/meterType';
import {WB_Tariff} from '../collection/tariff';
import {WB_MeterCode} from '../collection/meterCode';
import {WB_Category} from '../collection/category';
import {WB_ChangeBlock} from "./changeBlock";

export const VW_Customer = new Mongo.Collection("vw_customer");
export const WB_Customer = new Mongo.Collection("wb_customer");


Wb_changeBlockSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    customerId: {
        type: String,
        index: true
    },
    customerDistrict: {
        type: String,
        label: "District",
        index: true
    },
    customerQuartier: {
        type: String,
        label: "Quartier",
        index: true
    },
    customerBlock: {
        type: String,
        label: "Block",

        index: true
    },
    customerFolio: {
        type: String,
        label: "Folio",

        index: true
    },
    customerSuccessor: {
        type: String,
        label: "Successor",

        index: true
    },
    customerStreet: {
        type: String,
        label: "Street",

        index: true
    },
    customerDPC: {
        type: String,
        label: "DPC",
        index: true
    },
    newDPC: {
        type: String,
        optional: true,
        label: "New DPC",
        index: true
    },
    newDistrict: {
        type: String,
        label: "New District",
        index: true
    },
    newQuartier: {
        type: String,
        label: "New Quartier",
        index: true
    },
    newFolio: {
        type: String,
        label: "New Folio",
        min: 4,
        max: 4,
        index: true
    },
    newBlock: {
        type: String,
        label: "New Block",

        index: true
    },
    newSuccessor: {
        type: String,
        label: "New Successor",
        index: true,
        min: 1,
        max: 1
    },
    newStreet: {
        type: String,
        label: "New Street",
        index: true
    },
    changeDate: {
        type: Date,
        label: "Change Date",
        optional: true,
        // defaultValue: moment().toDate(),
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
        type: Date,
        label: "Change Date",
        optional: true,
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


Wb_locationSchema = new SimpleSchema({
    province: {
        type: String,
        autoform: {
            type: 'select'
        }
    },
    district: {
        type: String,
        autoform: {
            type: 'select'
        }
    },
    commune: {
        type: String,
        autoform: {
            type: 'select'
        }
    },
    village: {
        type: String,
        autoform: {
            type: 'select'
        }
    },
    x: {
        type: Number,
        decimal: true,
        optional: true
    },
    y: {
        type: Number,
        decimal: true,
        optional: true
    }
});

WB_Customer.schema = new SimpleSchema({
    sumId: {
        type: String,
        optional: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        label: "Name*",
        index: true,
        // optional: true
    },
    khName: {
        type: String,
        label: "Khmer Name*",
        // optional: true,
        index: true

    },
    dpc: {
        type: String,
        label: "DPC",
        optional: true
    },
    district: {
        type: String,
        label: "District",
        optional: true,
        index: true,
        autoform: {
            type: "select"
        }
    },
    quartier: {
        index: true,
        type: String,
        label: "Quartier",
        optional: true,
        autoform: {
            type: 'select'
        }
    },
    block: {
        index: true,
        optional: true,
        type: String,
        autoform: {
            type: 'select'
        }
    },
    folio: {
        type: String,
        min: 4,
        max: 4,
    },
    successor: {
        type: String,
        min: 1,
        max: 1
    },
    category: {
        index: true,
        type: String,
        autoform: {
            type: 'select',
            options() {
                let list = [];
                // list.push({label: '(Select One)', value: ''});
                WB_Category.find({}).forEach(function (cat) {
                    list.push({label: cat.name, value: cat._id});
                });
                return list;
            }
        }
    },
    activity: {
        type: String,
        autoform: {
            type: 'select2'
        }
    },
    group: {
        type: String,
        optional: true,
        autoform: {
            type: 'select'
        }
    },
    tariff: {
        type: String,
        autoform: {
            type: 'select',
            options() {
                let list = [];
                let categoryId = AutoForm.getFieldValue('category');
                if (!!categoryId) {
                    let tariff = WB_Tariff.find({categoryId: categoryId});
                    tariff.forEach(function (doc) {
                        list.push({label: `${doc.code}`, value: doc._id});
                    });
                }
                return list;
            }
        }
    },
    class: {
        type: String,
        optional: true,
        autoform: {
            type: 'select'
        }
    },
    position: {
        type: String,
        index: true,
        autoform: {
            type: 'select',
            options() {
                return [
                    {label: 'Active', value: 'active'},
                    {label: 'Inactive', value: 'inactive'},
                ];
            }
        }
    },
    operationCode: {
        type: String,
        label: "Operation Code",
        optional: true,
        autoform: {
            type: 'select'
        }
    },
    streetNo: {
        type: String,
        label: "Street No",
        optional: true,
        index: true
    },
    address: {
        type: String,
        label: "Address",
        optional: true
    },
    pipeId: {
        type: String,
        optional: true,
        label: "Pipe ID"
    },
    phoneNumber: {
        type: String,
        label: "Phone Number",
        optional: true
    },
    contact: {
        type: String,
        label: "Contact",
        optional: true
    },
    location: {
        type: Wb_locationSchema,
        optional: true
    },
    changeBlock: {
        type: [Wb_changeBlockSchema],
        optional: true
    },
    billingCycle: {
        type: Number,
        decimal: true,
        autoform: {
            type: 'select2',
            options() {
                return [
                    {label: '1 month', value: 1},
                    {label: '2 months', value: 2},
                    {label: '3 months', value: 3},
                    {label: '4 months', value: 4},
                    {label: '5 months', value: 5},
                    {label: '6 months', value: 6},
                ]
            }
        }

    },
    meterReference: {
        type: [Object],
        optional: true
    },
    'meterReference.$.refId': {
        type: String,
        optional: true,
        autoform: {
            type: 'select2',
            options() {
                if (Meteor.isClient) {
                    let sub = Meteor.subscribe('wb_reference', {});
                    if (sub.ready()) {
                        let references = WB_Reference.find({});
                        let list = [];
                        references.forEach(function (reference) {
                            list.push(
                                {label: `${reference.code} | ${reference.name}`, value: reference._id}
                            )
                        });
                        return list;
                    }
                }
            }
        }
    },
    rolesArea: {
        type: String,
        optional: true
    },
    newReading: {
        type: Number,
        decimal: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    prevReading: {
        type: Number,
        decimal: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    prevReadingDate: {
        index: true,
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker",
                datePickerOptions: {
                    autoclose: true
                }
            }
        }
    },
    newReadingDate: {
        type: Date,
        optional: true,
    },
    contract: {
        type: Object,
        optional: true
    },
    'contract.contractDate': {
        type: Date,
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
    'contract.familyHeadCount': {
        type: Number,
        defaultValue: 0,
        optional: true,
    },
    'contract.tableOrRoom': {
        type: Number,
        defaultValue: 0,
        optional: true,
    },
    'contract.meterCode': {
        type: String,
        optional: true,
        autoform: {
            type: 'select2',
            options() {
                let meterCodes = WB_MeterCode.find({});
                let list = [];
                meterCodes.forEach(function (doc) {
                    list.push({label: `${doc.code} | ${doc.name}`, value: doc._id});
                });
                return list;
            }
        }
    },
    'contract.meterSerialNo': {
        type: String,
        optional: true
    },
    'contract.meterDiameter': {
        type: Number,
        optional: true,
    },
    'contract.meterInstallDate': {
        type: Date,
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
    'contract.meterInstallData': {
        type: Number,
        optional: true
    },
    'contract.prevReadingDate': {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                }
            }
        }
    },
    'contract.prevReading': {
        type: Number,
        decimal: true
    },
    'contract.meterTypeId': {
        type: String,
        autoform: {
            type: 'select2',
            options() {
                let meterTypes = WB_MeterType.find({});
                let list = [];
                meterTypes.forEach(function (doc) {
                    list.push({label: `${doc.diameter}${doc.unit}`, value: doc._id});
                });
                return list;
            }
        }
    },
    'avgWaterConsumption': {
        type: Number,
        decimal: true,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    balance: {
        type: Number,
        decimal: true,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },

    newCustomerId: {
        type: String,
        optional: true
    },
    newCustomerSuffix: {
        type: String,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return "0001";
            }
        }

    },
    changeBlockId: {
        type: String,
        optional: true
    },
    contractUpdated: {
        type: Boolean,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    meterChangeHistoryId: {
        type: String,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return null;
            }
        }
    },
    desc: {
        optional: true,
        type: String
    }
});


/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_Customer.attachSchema(WB_Customer.schema);
});