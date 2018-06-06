export const Acc_ChartAccount = new Mongo.Collection('acc_chartAccount');

Acc_ChartAccount.schema = new SimpleSchema({
    code: {
        type: String,
        label: "Code",
        // unique: true,
        max: 7
    },
    name: {
        type: String,
        label: "Name"
    },
    khName: {
        type: String,
        label: "Khmer Name",
        optional: true
    },

    subAccountOf: {
        type: String,
        label: "SubAccount Of",
        optional: true,
        defaultValue: ""
    },
    accountTypeId: {
        type: String,
        label: "Account Type",
    },
    level: {
        type: Number,
        optional: true,
        defaultValue: 0,
        max: 2
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    isPaidTax: {
        type: Boolean,
        label: "Paid Tax"
    },
    endingBalance: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    isPayment: {
        type: Boolean,
        label: "Is Payment",
        defaultValue: false
    },
    mapToAccount: {
        type: String,
        optional: true
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

Acc_ChartAccount.attachSchema(Acc_ChartAccount.schema);