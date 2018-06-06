export const Pos_AverageInventory = new Mongo.Collection('pos_averageInventory');

Pos_AverageInventory.schema = new SimpleSchema({
    cusVendId: {
        type: String,
        label: "Customer/Vendor"
    },
    cusVendName: {
        type: String,
        label: "Customer/Vendor Name",
        optional: true
    },

    locationId: {
        type: String,
        label: "Location"
    },
    transactionId: {
        type: String,
        label: "Transaction"
    },
    averageInventoryDate: {
        type: Date
    },
    averageInventoryDateName: {
        type: String,
        optional: true
    },
    itemId: {
        type: String,
        label: "Item"
    },
    qty: {
        type: Number,
        decimal: true,
        label: "Qty"
    },
    price: {
        type: Number,
        decimal: true,
        label: "Price"
    },
    amount: {
        type: Number,
        decimal: true,
        label: "Amount"
    },
    amountEnding: {
        type: Number,
        decimal: true,
        label: "Amount Ending"
    },
    qtyEnding: {
        type: Number,
        decimal: true,
        label: "Qty Ending"
    },
    averageCost: {
        type: Number,
        decimal: true,
        label: "Average Cost"
    },
    profit: {
        type: Number,
        decimal: true,
        label: "Profit",
        optional: true
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
    rolesArea: {
        type: String,
        label: "Role Area"
    }

});

Pos_AverageInventory.attachSchema(Pos_AverageInventory.schema);