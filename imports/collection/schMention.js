export const Sch_Mention = new Mongo.Collection('sch_mention');

Sch_Mention.schema = new SimpleSchema({
    date: {
        type: Date,
        label: "Date"
    },
    dateName: {
        type: String,
        label: "Date",
        optional: true
    },
    range: {
        type: [Object],
        optional: true
    },
    "range.$.from": {
        type: Number,
        decimal: true,
        optional: true
    },
    "range.$.to": {
        type: Number,
        decimal: true,
        optional: true
    },
    "range.$.grade": {
        type: String,
        optional: true,
        defaultValue: ""
    },
    "range.$.gradePoint": {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    status: {
        type: Boolean,
        optional: true
    },
    rolesArea: {
        type: String,
        label: "Role Area"
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
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return Meteor.userId();
            }
        }
    }
});

Sch_Mention.attachSchema(Sch_Mention.schema);