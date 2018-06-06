export const WB_Saving = new Mongo.Collection('wb_saving');
export const WB_SavingDetail = new Mongo.Collection('wb_savingDetail');
WB_Saving.schema = new SimpleSchema({
    balance: {
        type: Number,
        decimal: true,
        index: true
    },
    customerId: {
        type: String,
        index: true
    },
    rolesArea: {
        type: String,
        index: true
    }
});

WB_SavingDetail.schema = new SimpleSchema({
    type: {
        type: String,
        index: true
    },
    amount: {
        type: Number,
        decimal: true,
        index: true
    },
    insertFrom: {
        type: String,
        optional: true,
        index: true
    },
    refFrom: {
        type: String,
        optional: true,
        index: true
    },
    description: {
        type: String,
        optional: true,
    },
    savingId: {
        type: String,
        index: true
    },
    customerId: {
        type: String,
        index: true
    },
    date: {
        type: Date,
        index: true
    },
    createdAt: {
        type: Date,
        autoValue(){
            if (this.isInsert) {
                return moment().toDate()
            }
        }
    },
    status: {
        type: String,
        optional: true
    },
    createdBy: {
        type: String
    }
});

WB_Saving.attachSchema(WB_Saving.schema);
WB_SavingDetail.attachSchema(WB_SavingDetail.schema);