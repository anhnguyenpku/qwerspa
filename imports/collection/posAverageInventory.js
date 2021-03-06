export const Pos_AverageInventory = new Mongo.Collection('pos_averageInventory');
export const Pos_AverageInventory2 = new Mongo.Collection('pos_averageInventory2');

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
        label: "Location",
        index: true
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
        label: "Item",
        index: true
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
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index: true
    }

});

Pos_AverageInventory2.schema = new SimpleSchema({
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
        label: "Location",
        index: true
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
        label: "Item",
        index: true
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
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index: true
    }

});


Pos_AverageInventory.attachSchema(Pos_AverageInventory.schema);
Pos_AverageInventory2.attachSchema(Pos_AverageInventory2.schema);