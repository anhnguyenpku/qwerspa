export const Sch_Payment = new Mongo.Collection('sch_payment');

Sch_Payment.schema = new SimpleSchema({
    studentId: {
        type: String,
        label: "Student"
    },
    classId: {
        type: String,
        label: "Class"
    },
    schedule: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    'schedule.$._id': {
        type: String
    },
    'schedule.$.receivePaymentScheduleDate': {
        type: Date
    },

    'schedule.$.isApplyTerm': {
        type: Boolean,
        defaultValue: true
    },
    'schedule.$.isPaid': {
        type: Boolean,
        defaultValue: true
    },
    'schedule.$.amount': {
        type: Number,
        decimal: true
    },
    'schedule.$.rawAmount': {
        type: Number,
        decimal: true
    },
    'schedule.$.discount': {
        type: Number,
        decimal: true
    },
    'schedule.$.netAmount': {
        type: Number,
        decimal: true
    },
    'schedule.$.paid': {
        type: Number,
        decimal: true
    },
    'schedule.$.dayOverDue': {
        type: Number,
        decimal: true
    },
    paymentDate: {
        type: Date,
        label: 'Receive Payment Date'
    },
    paymentDateName: {
        type: String,
        optional: true
    },
    totalAmount: {
        type: Number,
        label: "Total Amount",
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    totalNetAmount: {
        type: Number,
        label: "Paid",
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    totalPaid: {
        type: Number,
        label: "Paid",
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    totalDiscount: {
        type: Number,
        label: "Discount",
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    balanceUnPaid: {
        type: Number,
        label: "Balance",
        decimal: true
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
    note: {
        type: String,
        optional: true
    },
    paymentNo: {
        type: String,
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
    }

});

Sch_Payment.attachSchema(Sch_Payment.schema);