export const Sch_PaymentSchedule = new Mongo.Collection('sch_paymentSchedule');

Sch_PaymentSchedule.schema = new SimpleSchema({
    studentId: {
        type: String,
        label: "Student"
    },
    classId: {
        type: String,
        label: "Class"
    },
    order: {
        type: Number
    },
    isPaid: {
        type: Boolean,
        defaultValue: true
    },
    amount: {
        type: Number,
        decimal: true
    },
    rawAmount: {
        type: Number,
        decimal: true
    },
    discount: {
        type: Number,
        decimal: true
    },
    netAmount: {
        type: Number,
        decimal: true
    },
    paid: {
        type: Number,
        decimal: true
    },
    receivePaymentScheduleDate: {
        type: Date,
        label: 'Receive PaymentSchedule Date'
    },
    receivePaymentScheduleDateName: {
        type: String,
        optional: true
    },
    paymentNumber: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    rolesArea: {
        type: String,
        optional: true
    },
    canRemove: {
        type: Boolean,
        defaultValue: true,
        optional: true
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
    },
    balanceNotCut: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    status: {
        type: String,
        defaultValue: "Active"
        //    Active
        //    Partial
        //    Complete
    },
    closeDate: {
        type: Date,
        optional: true
    }

});

Sch_PaymentSchedule.attachSchema(Sch_PaymentSchedule.schema);