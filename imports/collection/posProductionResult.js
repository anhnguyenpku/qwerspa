export const Pos_ProductionResult = new Mongo.Collection('pos_productionResult');

Pos_ProductionResult.schema = new SimpleSchema({
    productionId: {
        type: String
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

Pos_ProductionResult.attachSchema(Pos_ProductionResult.schema);

export const Pos_ProductionResultReact = new Mongo.Collection('pos_productionResultReact');
Pos_ProductionResultReact.schema = new SimpleSchema({
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

Pos_ProductionResultReact.attachSchema(Pos_ProductionResultReact.schema);