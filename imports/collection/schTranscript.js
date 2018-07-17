export const Sch_Transcript = new Mongo.Collection('sch_transcript');

Sch_Transcript.schema = new SimpleSchema({
    studentId: {
        type: String
    },
    curiculumnId: {
        type: String
    },
    majorId: {
        type: String
    },
    registerId: {
        type: String
    },
    requiredCredit: {
        type: Number
    },
    isCompleted: {
        type: Boolean,
        defaultValue: false
    },
    rolesArea: {
        type: String,
        label: "Role Area"
    },
    culumnSemester1: {
        type: [Object]
    },
    "culumnSemester1.$.ind": {
        type: Number
    },
    "culumnSemester1.$.sem": {
        type: Number
    },
    "culumnSemester1.$.year": {
        type: Number
    },
    "culumnSemester1.$.subjectId": {
        type: String
    },
    "culumnSemester1.$.credit": {
        type: Number
    },
    "culumnSemester1.$.grade": {
        type: String,
        optional: true,

    },
    "culumnSemester1.$.gradePoint": {
        type: Number,
        decimal: true,
        optional: true,

    },
    "culumnSemester1.$.score": {
        type: Number,
        optional: true,
        decimal: true
    },
    culumnSemester2: {
        type: [Object]
    },
    "culumnSemester2.$.ind": {
        type: Number
    },
    "culumnSemester2.$.sem": {
        type: Number
    },
    "culumnSemester2.$.year": {
        type: Number
    },
    "culumnSemester2.$.subjectId": {
        type: String
    },
    "culumnSemester2.$.credit": {
        type: Number
    },
    "culumnSemester2.$.grade": {
        type: String,
        optional: true,
    },
    "culumnSemester2.$.gradePoint": {
        type: Number,
        decimal: true,
        optional: true,
    },
    "culumnSemester2.$.score": {
        type: Number,
        optional: true,
        decimal: true
    },
    state: {
        type: [Object],
        optional: true
    },
    "state.$.subjectId": {
        type: String,
        optional: true
    },
    "state.$.grade": {
        type: String,
        optional: true,
        defaultValue: 0
    },
    "state.$.gradePoint": {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    "state.$.score": {
        type: Number,
        optional: true,
        decimal: true,
        defaultValue: 0
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

Sch_Transcript.attachSchema(Sch_Transcript.schema);