export const WB_RequestUpdateJournalDetail = new Mongo.Collection('wb_requestUpdateJournalDetail');

let requestUpdateJournalDetail_schema = new SimpleSchema({
    doc: {
        type: Object,
        blackbox: true
    },
    status: {
        type: String,
        index: true
    },
    requestBy: {
        type: String,
        index: true
    },
    meterReadingId:{
        type: String,
        index: true
    },
    requestDate: {
        type: Date
    },
    statusDate: {
        type: Date,
        optional: true
    },
});

WB_RequestUpdateJournalDetail.attachSchema(requestUpdateJournalDetail_schema);