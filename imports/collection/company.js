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
    },
    rolesArea: {
        type: String
    }
});

WB_waterBillingSetup.attachSchema(WB_waterBillingSetup.schema);

