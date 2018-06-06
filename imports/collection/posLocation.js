export const Pos_Location = new Mongo.Collection('pos_location');

Pos_Location.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
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
    address: {
        type: String,
        optional: true
    },
    phoneNumber: {
        type: String,
        optional: true
    },
    note: {
        type: String,
        optional: true
    },
    applyUser: {
        type: [String],
        label: 'Apply User'
    },
    isMainLocation: {
        type: Boolean,
        defaultValue: false
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

Pos_Location.attachSchema(Pos_Location.schema);