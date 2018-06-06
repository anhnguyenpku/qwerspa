export const RefModify = new Mongo.Collection('ref-modify');

RefModify.schema = new SimpleSchema({
    type: { // rp, meterReadingJournalDetail
        type: String,
    },
    action: {
        type: String
    },
    modifiedDate: {
        type: Date
    },
    modifiedTime: {
      type: Number
    },
    modifiedBy: {
        type: String,
        optional: true
    },
    document: {
        type: Object,
        blackbox: true
    }
});

RefModify.attachSchema(RefModify.schema);