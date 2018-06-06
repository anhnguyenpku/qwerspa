export const Wb_activity = new Mongo.Collection('wb_activity');

Wb_activity.schema = new SimpleSchema({
    code: {
        unique: true,
        type: String
    },
    name:{
        type: String
    },
    rolesArea: {
        type: String,
        optional: true
    }

});

Wb_activity.attachSchema(Wb_activity.schema);