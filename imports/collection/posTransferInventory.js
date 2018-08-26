export const Pos_TransferInventory = new Mongo.Collection('pos_transferInventory');

Pos_TransferInventory.schema = new SimpleSchema({
    locationFromId: {
        type: String,
        label: "Location From",
        index:true
    },
    locationToId: {
        type: String,
        label: "Location To",
        index:true
    },
    transferInventoryDate: {
        type: Date,
        index:true
    },
    transferInventoryDateName: {
        type: String,
        optional: true
    },
    note: {
        type: String,
        optional: true
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index:true
    },
    total: {
        type: Number,
        decimal: true
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
    'item.$.cost': {
        type: Number,
        decimal: true
    },
    'item.$.rawQty': {
        type: Number
    },
    'item.$.qty': {
        type: Number
    },
    'item.$.amount': {
        type: Number,
        decimal: true
    },
    'item.$.desc': {
        type: String,
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

Pos_TransferInventory.attachSchema(Pos_TransferInventory.schema);