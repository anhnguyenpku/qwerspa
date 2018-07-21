
export const Acc_AccountSetup = new Mongo.Collection('acc_accountSetup');

Acc_AccountSetup.schema = new SimpleSchema({
    retainEarning: {
        type: String,
        label: "Retain Earning"
    },
    equivalenceForeignExchangePositionAccount: {
        type: String,
        label: "Equivalence Foreign Exchange Position Account"
    },
    foreignExchangePositionAccount: {
        type: String,
        label: "Foreign Exchange Position Account"
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
    }
});

Acc_AccountSetup.attachSchema(Acc_AccountSetup.schema);