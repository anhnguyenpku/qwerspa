export const Sch_Level = new Mongo.Collection('sch_level');

Sch_Level.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        index:true
    },
    khName: {
        type: String,
        label: "Khmer",
        optional: true
    },
    code: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    price: {
        type: Number,
        decimal: true
    },
    term: {
        type: Number
    },
    programId: {
        type: String
    },
    majorId: {
        type: String
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index:true
    },
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        },
        index:true
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

Sch_Level.attachSchema(Sch_Level.schema);