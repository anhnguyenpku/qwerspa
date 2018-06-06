export const WB_waterBillingSetup = new Mongo.Collection('wb_waterBillingSetup');


WB_waterBillingSetup.schema = new SimpleSchema({
    enName: {
        type: String
    },
    khName: {
        type: String
    },
    enShortName: {
        type: String
    },
    khShortName: {
        type: String
    },
    waterBillingUsageShortName: {
        type: String
    },
    rolesArea: {
        type: String
    },
    invoiceExpiredAfter: {
        type: Number,
        autoValue() {
            if (this.isInsert) {
                return 7;
            }
        }
    },
    enableZeroWaterConsumption: {
        type: Boolean,
        autoValue() {
            if (this.isInsert) {
                return false;
            }
        }
    },
    makeIn: {
        type: String,
        optional: true,
    },
    baseCurrency: {
        type: String
    },
    roundType: {
        type: String
    },
    khrDigit: {
        type: Number,
        defaultValue: -2
    },
    usdDigit: {
        type: Number,
        defaultValue: 2
    },
    thbDigit: {
        type: Number,
        defaultValue: 0
    },
    cutValue: {
        type: Number,
        defaultValue: 480
    },
    address: {
        type: String,
        optional: true
    },
    phoneNumber: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    website: {
        type: String,
        optional: true
    }
});

WB_waterBillingSetup.attachSchema(WB_waterBillingSetup.schema);