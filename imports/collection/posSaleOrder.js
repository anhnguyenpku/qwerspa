export const Pos_SaleOrder = new Mongo.Collection('pos_saleOrder');

Pos_SaleOrder.schema = new SimpleSchema({
    customerId: {
        type: String,
        label: "Customer",
        index:true
    },

    locationId: {
        type: String,
        label: "Location",
        index:true
    },
    address: {
        type: String,
        label: "Address",
        optional: true
    },
    termId: {
        type: String
    },
    saleOrderDate: {
        type: Date,
        index:true
    },
    saleOrderDateName: {
        type: String,
        optional: true
    },
    dueDate: {
        type: Date
    },
    saleOrderNo: {
        type: String
    },
    note: {
        type: String,
        optional: true
    },
    cutOnPaid: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    paid: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    paidUSD: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    paidKHR: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    paidTHB: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    remainUSD: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    remainKHR: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    remainTHB: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    total: {
        type: Number,
        decimal: true
    },
    netTotal: {
        type: Number,
        decimal: true
    },
    status: {
        type: String,
        defaultValue: "Active"
        //    Active
        //    Partial
        //    Complete
    },
    receiveNumber: {
        type: Number,
        optional: true,
        defaultValue: 0
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index:true
    },
    item: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    'item.$.itemId': {
        type: String
    },
    'item.$.itemName': {
        type: String
    },
    'item.$.unitId': {
        type: String
    },
    'item.$.unitName': {
        type: String
    },
    'item.$.price': {
        type: Number,
        decimal: true
    },
    'item.$.isRetail': {
        type: Boolean,
        defaultValue: true
    },
    'item.$.unit1': {
        type: Number,
        optional: true,
        decimal: true,
        defaultValue: 1

    },
    'item.$.unit2': {
        type: Number,
        optional: true,
        decimal: true,
        defaultValue: 1
    },
    'item.$.totalUnit': {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 1
    },
    'item.$.qty': {
        type: Number
    },
    'item.$.amount': {
        type: Number,
        decimal: true
    },
    'item.$.cost': {
        type: Number,
        decimal: true,
        optional: true
    },
    'item.$.totalCost': {
        type: Number,
        decimal: true,
        optional: true
    },
    'item.$.desc': {
        type: String,
        optional: true
    },
    'item.$.receive': {
        type: Number,
        decimal: true
    },
    'item.$.isReceive': {
        type: Boolean,
        defaultValue: false
    },
    discountType: {
        type: String,
        defaultValue: "Amount"
    },
    discountValue: {
        type: Number,
        decimal: true,
        defaultValue: 0
    },
    discount: {
        type: Number,
        decimal: true,
        defaultValue: 0
    },
    transactionType: {
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
    },
    closeDate: {
        type: Date,
        optional: true
    }
});

Pos_SaleOrder.attachSchema(Pos_SaleOrder.schema);