export const Sch_ClassTable = new Mongo.Collection('sch_classTable');

Sch_ClassTable.schema = new SimpleSchema({
    classId: {
        type: String,
        label: "Class"
    },
    studentList: {
        type: [Object],
        optional: true
    },
    "studentList.$._id": {
        type: String,
        label: "Register Id"
    },
    "studentList.$.studentId": {
        type: String,
        label: "Student"
    },
    "studentList.$.levelId": {
        type: String,
        label: "Level",
    },
    "studentList.$.programId": {
        type: String
    },
    "studentList.$.promotionId": {
        type: String
    },
    "studentList.$.classId": {
        type: String,
        optional: true
    },
    "studentList.$.term": {
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

Sch_ClassTable.attachSchema(Sch_ClassTable.schema);