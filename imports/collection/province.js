export const WB_Province = new Mongo.Collection('wb_province');

WB_Province.schema = new SimpleSchema({
    enName: {
        type: String
    },
    enShortName: {
        type: String
    },
    khName: {
        type: String
    },
    khShortName: {
        type: String
    },
    code: {
        type: String,
        index: true,
        unique: true,
    }
});

WB_Province.attachSchema(WB_Province.schema);