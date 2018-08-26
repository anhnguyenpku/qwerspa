export const Sch_TeacherActivity = new Mongo.Collection('sch_teacherActivity');

Sch_TeacherActivity.schema = new SimpleSchema({
    teacherId: {
        type: String,
        label: "Teacher",
        index:true
    },
    activityId: {
        type: String,
        label: "Activity",
        optional: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    startDateName: {
        type: String,
        optional: true
    },
    endDateName: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
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

Sch_TeacherActivity.attachSchema(Sch_TeacherActivity.schema);