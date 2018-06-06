import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {TAPi18n} from 'meteor/tap:i18n';

// Lib

export const UserSchema = new SimpleSchema({
    profile: {
        type: Object,
        label: 'Profile'
    },
    'profile.approved': {
        type: Boolean,
        label: 'Approved'
    },
    'profile.status': {
        type: String,
        optional: true,
        autoform: {
            type: 'select',
            options() {
                return [
                    {label: 'Enable', value: 'enable'},
                    {label: 'Disable', value: 'disable'}
                ]
            }
        }
    },
    'profile.modules': {
        type: [String],
        label: 'Module',
        autoform: {
            type: 'select-checkbox-inline',
            /* options() {
                 return [
                     {label: "Water Billing", value: "Water Billing"},
                     {label: "Accounting", value: "Accounting"},
                     {label: "POS", value: "POS"}
                 ]
             }*/
        }
    },
    username: {
        type: String,
        label: 'Username',
        unique: true,
        min: 3
    },
    email: {
        type: String,
        label: 'Email',
        unique: true,
        regEx: SimpleSchema.RegEx.Email
    },
    password: {
        type: String,
        label: 'Password',
        min: 6,
    },
    confirmPassword: {
        type: String,
        label: 'Comfirm Password',
        min: 6,
        custom: function () {
            if (this.value !== this.field('password').value) {
                return "passwordMismatch";
            }
        },

    },
    roles: {
        type: [String],
        label: 'Roles',
        autoform: {
            // multiple: true,
            type: 'select-checkbox-inline',
            options() {
                return [
                    {label: 'Setting', value: 'setting'},
                    {label: 'Payment', value: 'payment'},
                    {label: 'Creditor', value: 'creditor'},
                    {label: 'Agent', value: 'agent'},
                    {label: 'Admin', value: 'admin'},
                    {label: 'Director', value: 'director'},
                    {label: 'Main Zone', value: 'mainZone'},
                    {label: 'Meter Reader', value: 'meterReader'},
                    {label: 'Control User', value: 'controlUser'},
                    {label: 'Report', value: 'report'},
                    {label: 'Report Customer', value: 'reportCustomer'},
                    {label: 'Report Vendor', value: 'reportVendor'},
                    {label: 'Data', value: 'data'},
                    {label: 'Purchase', value: 'purchase'},
                    {label: 'Sale', value: 'sale'},
                    {label: 'Remove', value: 'remove'},
                    {label: 'Update', value: 'update'}
                ]
            }
        }
    },
    rolesBranch: {
        type: String,
        label: 'Roles Branch',
        autoform: {
            type: 'select2',
        }
    },
    rolesArea: {
        type: [String],
        label: 'Roles Area',
        autoform: {
            type: 'select-checkbox-inline',
        }
    },
    areaId: {
        type: String,
        optional: true
    }
});