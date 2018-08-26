export const Sch_BusRegister = new Mongo.Collection('sch_busRegister');

Sch_BusRegister.schema = new SimpleSchema({
    studentId: {
        type: String,
        label: "Student",
        index: true
    },
    busId: {
        type: String,
        label: "Bus",
    },
    busStopId: {
        type: String,
        label: "Bus Stop",
    },
    discountType: {
        type: String
    },
    discount: {
        type: Number,
        decimal: true
    },
    busRegisterDate: {
        type: Date,
        index: true
    },
    busRegisterDateName: {
        type: String,
        optional: true
    },
    dueDate: {
        type: Date,
        optional: true
    },
    startDate: {
        type: Date,
        optional: true
    },
    price: {
        type: Number,
        decimal: true,

    },
    busStopType: {
        type: String
    },
    status: {
        type: String,
        label: "Status",
        optional: true,
        defaultValue: "Active"
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index: true
    },
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        },
        index: true
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

Sch_BusRegister.attachSchema(Sch_BusRegister.schema);