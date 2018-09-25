export const Sch_Payment = new Mongo.Collection('sch_payment');

Sch_Payment.schema = new SimpleSchema({
    studentId: {
        type: String,
        label: "Student",
        index:true
    },
    classId: {
        type: String,
        label: "Class",
        index:true
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

    'schedule.$.isPaid': {
        type: Boolean,
        defaultValue: true
    },
    'schedule.$.rawAmount': {
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
    'schedule.$.waived': {
        type: Number,
        decimal: true
    },
    'schedule.$.desc': {
        type: String,
        optional: true
    },
    paymentDate: {
        type: Date,
        label: 'Receive Payment Date',
        index: true
    },
    paymentDateName: {
        type: String,
        optional: true
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
    totalWaived: {
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
        optional: true,
        index:true
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
    penalty: {
        type: Number,
        decimal: true
    },
    fee: {
        type: Number,
        decimal: true
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

Sch_Payment.attachSchema(Sch_Payment.schema);

export const Sch_PaymentReact = new Mongo.Collection('sch_paymentReact');
Sch_PaymentReact.schema = new SimpleSchema({
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

Sch_PaymentReact.attachSchema(Sch_PaymentReact.schema);