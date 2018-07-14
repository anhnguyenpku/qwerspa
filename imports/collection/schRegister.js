export const Sch_Register = new Mongo.Collection('sch_register');

Sch_Register.schema = new SimpleSchema({
    studentId: {
        type: String,
        label: "Student"
    },
    levelId: {
        type: String,
        label: "Level",
    },
    majorId: {
        type: String,
        label: "Major",
    },
    programId: {
        type: String
    },
    promotionId: {
        type: String
    },
    classId: {
        type: String,
        optional: true
    },
    term: {
        type: Number
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

Sch_Register.attachSchema(Sch_Register.schema);