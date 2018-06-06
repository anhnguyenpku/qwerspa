export const Pos_ReceivePayment = new Mongo.Collection('pos_receivePayment');

Pos_ReceivePayment.schema = new SimpleSchema({
    customerId: {
        type: String,
        label: "Customer"
    },
    locationId: {
        type: String,
        label: "Location"
    },
    invoice: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    'invoice.$.invoiceId': {
        type: String
    },
    'invoice.$.invoiceNo': {
        type: String
    },
    'invoice.$.dueDate': {
        type: Date
    },

    'invoice.$.isApplyTerm': {
        type: Boolean,
        defaultValue: true
    },
    'invoice.$.isPaid': {
        type: Boolean,
        defaultValue: true
    },
    'invoice.$.amount': {
        type: Number,
        decimal: true
    },
    'invoice.$.rawAmount': {
        type: Number,
        decimal: true
    },
    'invoice.$.discount': {
        type: Number,
        decimal: true
    },
    'invoice.$.netAmount': {
        type: Number,
        decimal: true
    },
    'invoice.$.paid': {
        type: Number,
        decimal: true
    },
    'invoice.$.dayOverDue': {
        type: Number,
        decimal: true
    },
    receivePaymentDate: {
        type: Date,
        label: 'Receive Payment Date'
    },
    receivePaymentDateName: {
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
    invoiceId: {
        type: String,
        optional: true
    },
    saleOrderId: {
        type: String,
        optional: true
    },
    invoiceNo: {
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

Pos_ReceivePayment.attachSchema(Pos_ReceivePayment.schema);