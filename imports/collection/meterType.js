export const WB_MeterType = new Mongo.Collection('wb_meterType');
WB_MeterType.schema = new SimpleSchema({
    diameter: {
        type: Number,
        decimal: true
    },
    unit: {
        type: String
    },
    desc: {
        type: String,
        optional: true
    },
    maintenanceFee: {
        type: Number,
        decimal: true
    },
    rolesArea: {
        type: String,
        optional: true
    }
});

WB_MeterType.attachSchema(WB_MeterType.schema);

