export const Pos_ConvertInventory = new Mongo.Collection('pos_convertInventory');

Pos_ConvertInventory.schema = new SimpleSchema({
    productId: {
        type: String,
        index: true
    },
    qty: {
        type: Number,
        decimal: true
    },
    date: {
        type: Date
    },
    dateName: {
        type: String
    },
    locationId: {
        type: String,
        index: true
    },
    convert: {
        type: [Object],
        label: "Name"
    },
    "convert.$.productId": {
        type: String
    },
    "convert.$.qty": {
        type: Number,
        decimal: true
    },

    description: {
        type: String,
        label: "Description",
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true,
        index: true,

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
        },
        index: true
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

Pos_ConvertInventory.attachSchema(Pos_ConvertInventory.schema);

export const Pos_ConvertInventoryReact = new Mongo.Collection('pos_convertInventoryReact');
Pos_ConvertInventoryReact.schema = new SimpleSchema({
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

Pos_ConvertInventoryReact.attachSchema(Pos_ConvertInventoryReact.schema);