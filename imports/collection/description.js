export const Description = new Mongo.Collection('wb_description');

let description_schema = new SimpleSchema({
    icon: {
        type: String,
    },
    value: {
        type: String,
        unique: true,
        index: true
    },
    kh: {
        type: String
    },
    en: {
        type: String
    },
    code: {
        type: String,
        optional: true
    },
    isPinned: {
        type: Boolean,
        optional: true
    },
    type: {
        type: String,
        optional: true
    }

});

Description.attachSchema(description_schema);
