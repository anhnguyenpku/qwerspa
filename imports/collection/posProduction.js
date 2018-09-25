export const Pos_Production = new Mongo.Collection('pos_production');

Pos_Production.schema = new SimpleSchema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    dateName: {
        type: String
    },
    endDate: {
        type: Date,
        optional: true
    },
    endDateName: {
        type: String,
        optional: true
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
    status: {
        type: Boolean,
        optional: true,
        defaultValue: false
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

Pos_Production.attachSchema(Pos_Production.schema);

export const Pos_ProductionReact = new Mongo.Collection('pos_productionReact');
Pos_ProductionReact.schema = new SimpleSchema({
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

Pos_ProductionReact.attachSchema(Pos_ProductionReact.schema);