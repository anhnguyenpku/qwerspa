export const Transaction = new Mongo.Collection('wb_transaction');
export const TransactionDetail = new Mongo.Collection('wb_transactionDetail');
Transaction.schema = new SimpleSchema({
    rolesArea: {
        type: String,
        index: true
    },
    balance: {
        type: Number,
        decimal: true
    },
    customerId: {
        unique: true,
        type: String,
        index: true
    },
});

TransactionDetail.schema = new SimpleSchema({
    rolesArea: {
        type: String,
        index: true
    },
    customerId: {
        type: String,
        index: true
    },
    amountIfEnableWaterConsumptionIsZero: {
        type: Number,
        decimal: true,
        optional: true
    },
    amount: {
        type: Number,
        decimal: true,
        index: true,
    },
    transId: {
        type: String,
        index: true
    },
    refId: {
        type: String,
        index: true
    },
    type: { //like payment,posted,saving,
        type: String,
        index: true
    },
    date: {
        type: Date,
        index: true,
    },
    status: {
        type: String,
        index: true,
    },
    closingAt: {
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
    }
});

Transaction.attachSchema(Transaction.schema);
TransactionDetail.attachSchema(TransactionDetail.schema);
