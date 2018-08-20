export const Sch_Position = new Mongo.Collection('sch_position');

Sch_Position.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    khName: {
        type: String,
        label: "Khmer",
        optional: true
    },
    desc: {
        type: String,
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

Sch_Position.attachSchema(Sch_Position.schema);