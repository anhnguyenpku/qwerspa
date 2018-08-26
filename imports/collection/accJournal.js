export const Acc_Journal = new Mongo.Collection('acc_journal');

Acc_Journal.schema = new SimpleSchema({
    journalDate: {
        type: Date,
        label: "Journal Date",
        index: true
    },
    journalDateName: {
        type: String,
        label: "Journal Date",
        optional: true
    },
    voucherId: {
        type: String,
        label: "Voucher"
    },
    currencyId: {
        type: String,
        label: "Currency"
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index: true
    },
    memo: {
        type: String,
        label: "Description"
    },
    splitAccount: {
        type: String,
        label: "splitAccount",
        optional: true
    }
    ,
    name: {
        type: String,
        optional: true
    },
    transaction: {
        type: [Object],
        minCount: 1,
        optional: true
    },
    'transaction.$': {
        type: Object
    },
    'transaction.$.account': {
        type: String,
        max: 200,
        optional: true,
        label: "Chart Of Account"
    }
    ,
    'transaction.$.dr': {
        type: Number,
        decimal: true,
        optional: true,
        label: "Debit"
    }
    ,
    'transaction.$.cr': {
        type: Number,
        decimal: true,
        optional: true,
        label: "Credit"
    }
    ,
    'transaction.$.drcr': {
        type: Number,
        decimal: true,
        optional: true
    }
    ,
    total: {
        type: Number,
        decimal: true,
        label: "Total",
        optional: true
    }
    ,
    closingEntryId: {
        type: String,
        optional: true,
        defaultValue: "0"
    }
    ,
    refId: {
        type: String,
        optional: true
    },
    refFrom: {
        type: String,
        optional: true
    },
    status: {
        type: String,
        optional: true,
        defaultValue: "Normal"
    },
    isCurrencyClosing: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        optional: true,
        index: true,
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

Acc_Journal.attachSchema(Acc_Journal.schema);