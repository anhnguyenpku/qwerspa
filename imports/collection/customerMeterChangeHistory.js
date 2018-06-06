export const WB_CustomerMeterChangeHistory = new Mongo.Collection('wb_customerMeterChangeHistory');

WB_CustomerMeterChangeHistory.schema = new SimpleSchema({
    newContract: {
        type: Object,
        blackbox: true
    },
    history: {
        type: Object,
        blackbox: true
    },
    modifiedDate: {
        type: Date
    },
    rolesArea: {
        type: String,
        optional: true
    }
});

WB_CustomerMeterChangeHistory.attachSchema(WB_CustomerMeterChangeHistory.schema);