export const Acc_Exchange = new Mongo.Collection("acc_exchange");

let Rates = new SimpleSchema({
    USD: {
        type: Number,
        defaultValue: 1,
        decimal: true,
        min: 0.000000001
    },
    KHR: {
        type: Number,
        decimal: true,
        min: 0.000000001,
    },

    THB: {
        type: Number,
        decimal: true,
        min: 0.000000001,
    }
});

Acc_Exchange.schema = new SimpleSchema({
    exDate: {
        type: Date,
        unique: true,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "pickadate",
                pickadateOptions: {
                    // selectMonths: true, // Creates a dropdown to control month
                    selectYears: 170 // Creates a dropdown of 15 years to control year
                }
            }
        }
    },
    base: {
        type: String,
        defaultValue: "USD"
    },
    rates: {
        type: Rates,
    },
    rolesArea: {
        type: String,
        optional: true
    },
    status: {
        type: Boolean,
        label: "Status",
        defaultValue: false,
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

Acc_Exchange.attachSchema(Acc_Exchange.schema);

export const Acc_ExchangeReact = new Mongo.Collection('acc_exchangeReact');
Acc_ExchangeReact.schema = new SimpleSchema({
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
    },
    id: {
        type: String
    }
});

Acc_ExchangeReact.attachSchema(Acc_ExchangeReact.schema);