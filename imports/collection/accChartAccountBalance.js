export const Acc_ChartAccountBalance = new Mongo.Collection('acc_chartAccountBalance');

Acc_ChartAccountBalance.schema = new SimpleSchema({
    chartAccountId: {
        type: String,
        index: true,

    },
    value: {
        type: Number,
        decimal: true
    },
    closeDate: {
        type: Date,
        index: true,

    },
    currencyId: {
        type: String
    },
    month: {
        type: String
    },
    year: {
        type: String
    },
    closingEntryId: {
        type: String,
        index: true,

    },
    rolesArea: {
        type: String,
        index:true

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

Acc_ChartAccountBalance.attachSchema(Acc_ChartAccountBalance.schema);