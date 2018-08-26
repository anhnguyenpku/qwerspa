export const Pos_PayBill = new Mongo.Collection('pos_payBill');

Pos_PayBill.schema = new SimpleSchema({
    vendorId: {
        type: String,
        label: "Vendor",
        index:true
    },
    locationId: {
        type: String,
        label: "Location",
        index:true
    },
    bill: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    'bill.$.billId': {
        type: String
    },
    'bill.$.billNo': {
        type: String
    },
    'bill.$.dueDate': {
        type: Date
    },
    'bill.$.isApplyTerm': {
        type: Boolean,
        defaultValue: true
    },
    'bill.$.isPaid': {
        type: Boolean,
        defaultValue: true
    },
    'bill.$.amount': {
        type: Number,
        decimal: true
    },
    'bill.$.rawAmount': {
        type: Number,
        decimal: true
    },
    'bill.$.discount': {
        type: Number,
        decimal: true
    },
    'bill.$.netAmount': {
        type: Number,
        decimal: true
    },
    'bill.$.paid': {
        type: Number,
        decimal: true
    },
    'bill.$.dayOverDue': {
        type: Number,
        decimal: true
    },
    payBillDate: {
        type: Date,
        label: 'Receive Payment Date'
    },
    payBillDateName: {
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
    billId: {
        type: String,
        optional: true
    },
    billNo: {
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

Pos_PayBill.attachSchema(Pos_PayBill.schema);