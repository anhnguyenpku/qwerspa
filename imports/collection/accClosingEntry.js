export const Acc_ClosingEntry = new Mongo.Collection('acc_closingEntry');

Acc_ClosingEntry.schema = new SimpleSchema({
    closeDate: {
        type: Date,
        label: "Date",
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "pickadate",
                pickadateOptions: {
                    selectYears: 170 // Creates a dropdown of 15 years to control year
                }
            }
        }
    },
    rolesArea: {
        type: String,
        label: "Role Area"
    },
    month: {
        type: String,
        optional: true
    },
    year: {
        type: String,
        optional: true
    },
    closeDateName: {
        type: String,
        optional: true
    },
    exchangeId:{
        type: String,
        optional:true
    },
    createdAt: {
        type: Date,
        optional:true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional:true,

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

Acc_ClosingEntry.attachSchema(Acc_ClosingEntry.schema);