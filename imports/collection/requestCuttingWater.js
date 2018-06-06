export const WB_RequestCuttingWater = new Mongo.Collection('wb_requestCuttingWater');

let schema = new SimpleSchema({
    invoiceExpiredAfter: {
        type: Number,
        decimal: true
    },
    newReadingDate: {
        type: Date
    },
    journalBookDetailId: {
        type: String,
        index: true
    },
    streetNo: {
        type: String
    },
    dpc: {
        type: String
    },
    customerId: {
        type: String,
        index: true
    },
    blockId: {
        index: true,
        type: String
    },
    isCutOff: {
        index: true,
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return true;
            }
        }
    },
    status: {
        type: String,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return 'active';
            }
        }
    },
    rolesArea: {
        type: String,
        optional: true
    },
    requestedOpen: {
        type: Boolean,
        index: true,
        autoValue() {
             if(this.isInsert){
                 return false;
             }
        }
    },
    openedAt: {
        type: Date,
        index: true,
        optional: true
    },
    closedAt: {
        type: Date,
        index: true,
        optional: true,
    },
    toggleOffBy: {
        type: String,
        optional: true
    },
    toggleOnBy: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    paidAt: {
        type: Date,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    }
});

WB_RequestCuttingWater.attachSchema(schema);