export const Sch_ClassTable = new Mongo.Collection('sch_classTable');

Sch_ClassTable.schema = new SimpleSchema({
    classId: {
        type: String,
        label: "Class",
        index: true
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
    "studentList.$.programId": {
        type: String
    },
    "studentList.$.majorId": {
        type: String,
        label: "Major",
    },
    "studentList.$.levelId": {
        type: String,
        label: "Level",
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
    "studentList.$.isPromote": {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    "studentList.$.registerDate": {
        type: Date
    },
    "studentList.$.startClassDate": {
        type: Date,
        optional: true
    },
    "studentList.$.newClassId": {
        type: String,
        optional: true
    },
    "studentList.$.isChangeClass": {
        type: Boolean,
        defaultValue: false,
        optional: true
    },
    "studentList.$.isGenerated": {
        type: Boolean,
        defaultValue: false,
        optional: true
    },
    "studentList.$.status": {
        type: String,
        defaultValue: "Active",
        optional: true
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

Sch_ClassTable.attachSchema(Sch_ClassTable.schema);

export const Sch_ClassTableReact = new Mongo.Collection('sch_classTableReact');
Sch_ClassTableReact.schema = new SimpleSchema({
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
    },
    id: {
        type: String
    }
});

Sch_ClassTableReact.attachSchema(Sch_ClassTableReact.schema);