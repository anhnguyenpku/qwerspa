export const Wb_meterReadingJournal = new Mongo.Collection('wb_meterReadingJournal');

Wb_meterReadingJournal.schema = new SimpleSchema({
    date: {
        type: Date,
        index: true
    },
    name: {
        type: String
    },
    rolesArea: {
        type: String,
        optional: true,
        index: true
    },
    meterReadingId: {
        type: String,
        label: "Meter Reading Query",
        index: true,
    },
    generate: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    journalPostedCount: {
        type: Number,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    journalDetailCount: {
        type: Number,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    validateDate: { //using for check if meter reading journal book has been created in the same month
        type: Date,
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
    createdBy: {
        type: String,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedBy: {
        type: String,
        optional: true,
    },
    lastSynced: {
        type: String,
        optional: true

    },
    syncedBy: {
        type: [String],
        optional: true,
        index: true
    },
    isLocked: {
        type: Boolean,
        optional: true,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    }
});

Wb_meterReadingJournal.attachSchema(Wb_meterReadingJournal.schema);


export const WB_MeterReadingJournalDetail = new Mongo.Collection('wb_meterReadingJournalDetails');
WB_MeterReadingJournalDetail.schema = new SimpleSchema({
    meterReadingJournalId: {
        type: String,
        index: true
    },
    billingPeriod: {
        optional: true,
        type: Date,
        label: "Billing Period",
        autoform: {
            type: "bootstrap-datepicker"
        }
    },
    customerTypeId: {
        optional: true,
        type: String,
        label: "Customer Type"
    },
    district: {
        type: String,
        label: "District",
        index: true
    },
    quartier: {
        type: String,
        label: "Quartier",
        index: true
    },
    block: {
        type: String,
        label: "Block",
        index: true
    },
    category: {
        type: String,
        label: "Category",
        index: true
    },
    tariff: {
        type: String,
        index: true
    },
    quantity: {
        type: Number,
        decimal: true,
        min: 0,
        autoValue() {
            return 0;
        }
    },
    position: {
        type: String,
        label: "Position",
        autoform: {
            type: 'select',
            options() {
                return [
                    {label: 'Active', value: 'active'},
                    {label: 'Inactive', value: 'inactive'},
                ]
            }
        }
    },
    operationCodeId: {
        optional: true,
        type: String,
        label: "Operation Code"
    },
    customerId: {
        type: String,
        index: true
    },
    prevReadingDate: {
        type: Date,
        optional: true,
    },
    newReadingDate: {
        type: Date,
        optional: true,
    },
    prevReading: {
        type: Number,
        optional: true
    },
    newReading: {
        type: Number,
        optional: true,
    },
    maintenanceFee: {
        type: Number,
        decimal: true,
        optional: true
    },
    maintenanceFeePrice: {
        type: Number,
        decimal: true,
        optional: true
    },
    isEstimated: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    printed: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    printedCount: {
        type: Number,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    waterConsumption: {
        type: Number,
        decimal: true,
        optional: true
    },
    priceList: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    price: {
        type: Number,
        decimal: true,
        optional: true,
    },
    contributionFeePrice: {
        type: Number,
        decimal: true,
        optional: true,
    },
    grandTotal: {
        type: Number,
        decimal: true,
        optional: true
    },
    written: {
        type: Boolean,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    saveWritten: {
        type: Boolean,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    paymentStatus: {
        type: String,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return 'active'
            }
        }
    },
    closedAt: {
        type: Date,
        index: true,
        optional: true
    },
    total: {
        type: Number,
        decimal: true,
        optional: true,
    },
    contributionFee: {
        type: Number,
        decimal: true,
        optional: true
    },
    rolesArea: {
        type: String,
        optional: true
    },
    barcode: {
        type: String,
        optional: true,
        index: true
    },
    // expiredDate: {
    //     type: Date,
    //     optional: true,
    //     index: true
    // },
    meterChangeHistory: {
        type: Object,
        blackbox: true,
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
                return moment().toDate()
            }
        }
    },
    createdBy: {
        type: String,
        optional: true,
        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedBy: {
        type: String,
        optional: true,
    },
    billingCycle: {
        type: Number,
        decimal: true
    },
    assignedUsers: {
        type: [String],
        optional: true
    },
    modifiedLevel: {
        type: Number,
        autoValue() {
            if (this.isInsert) {
                return 1;
            }
        }
    },
    balance: {
        type: Number,
        decimal: true,
        index: true,
        optional: true,
    },
    oldBalance: {
        type: Number,
        decimal: true,
        optional: true,
    },
    desc: {
        type: String,
        optional: true
    },
    meterChangeDesc: {//usage for  mobile meter change description
        type: String,
        optional: true
    },
    modifyTime: {
        type: Number,
        index: true,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    level: {
        type: Number,
        autoValue() {
            if (this.isInsert) {
                return 0;
            }
        }
    },
    oldMeterWaterConsumption: {
        type: Number,
        decimal: true,
        optional: true
    },
    newMeterWaterConsumption: {
        type: Number,
        decimal: true,
        optional: true
    },
    hasOldMeterWaterConsumption: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    isExpired: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    closedExpiredAt: {
        type: Date,
        optional: true
    },
    meterChangeType: {
        type: String,
        optional: true
    },
    oldPrevReading: {
        type: Number,
        optional: true
    },
    lastSynced: {
        type: String,
        optional: true,
    },
    lastModified: {
        type: String,
        optional: true,
    },
    syncedBy: {
        type: [String],
        optional: true
    },
    streetNo: {
        type: String,
        optional: true
    },
    dpc: {
        type: String,
        optional: true
    },
    requestCuttingWaterId: {
        type: String,
        index: true,
        optional: true
    },
    sumBarcode: {
        type: String,
        optional: true,
        index: true,
        unique: true
        
    }
});
WB_MeterReadingJournalDetail.attachSchema(WB_MeterReadingJournalDetail.schema);