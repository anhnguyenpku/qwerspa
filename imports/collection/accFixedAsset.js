export const Acc_FixedAsset = new Mongo.Collection('acc_fixedAsset');

Acc_FixedAsset.schema = new SimpleSchema({
    account: {
        type: String,
        label: "Chart Of Account"
    },
    value: {
        type: Number,
        decimal: true,
        label: "Value",
        optional: true
    },
    life: {
        type: Number,
        optional: true,
        label: "Life (Year)"
    },
    estSalvage: {
        type: Number,
        optional: true,
        label: "Estimate Salvage"
    },
    code: {
        type: String,
        label: "Code",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    buyDate: {
        type: Date,
        label: "Buy Date"
    },
    buyDateName: {
        type: String,
        label: "Buy Date",
        optional: true
    },
    voucherId: {
        type: String,
        label: "Voucher"

    },
    currencyId: {
        type: String,
        label: "Currency",
    },
    rolesArea: {
        type: String,
        optional: true
    }
    ,
    transaction: {
        type: [Object],
        blackbox: true,
        optional: true
    },
    'transaction.$': {
        type: Object,
        blackbox: true,
        optional: true
    },
    'transaction.$.year': {
        type: Number,
        blackbox: true
    },
    'transaction.$.perMonth': {
        type: Number,
        decimal: true,
        blackbox: true
    }, 'transaction.$.perYear': {
        type: Number,
        decimal: true,
        blackbox: true
    }, 'transaction.$.month': {
        type: Number,
        blackbox: true
    }, 'transaction.$.maxMonth': {
        type: Number,
        optional: true
    },
    'transaction.$.status': {
        type: Boolean,
        defaultValue: false
    },
    isDep: {
        type: Boolean,
        defaultValue: false
    },
    increment: {
        type: Number,
        defaultValue: 0
    },
    numberOfExpense: {
        type: Number,
        defaultValue: 0
    }

    ,
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

Acc_FixedAsset.attachSchema(Acc_FixedAsset.schema);