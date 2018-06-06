export const WB_MobileSync = new Mongo.Collection('wb_mobileSync');
let schema = new SimpleSchema({
    date: {
        type: Date,
        index: true,
    },
    dateStr: {
        type: String,
        index: true,
    },
    journalBookId: {
        type: String
    },
    journalDate: {
      type: String
    },
    meterReadingId: {
        index: true,
        type: String
    },
    userId: {
        type: String,
    },
    readBy: {
        type: [String],
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue(){
            if(this.isInsert) {
                return moment().toDate();
            }
        }
    }
});

WB_MobileSync.attachSchema(schema);