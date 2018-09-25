export const Pos_Term = new Mongo.Collection('pos_term');

Pos_Term.schema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    khName: {
        type: String,
        label: "Khmer Name",
        optional: true
    },
    dueMethod: {
        type: String
    },
    days: {
        type: Number,
        optional: true
    },
    daysOfMonth: {
        type: Number,
        optional: true
    },
    daysOfDueDate: {
        type: Number,
        optional: true
    },
    isDiscount: {
        type: Boolean,
        defaultValue: false
    },
    value: {
        type: Number,
        optional: true
    },
    daysForDiscount: {
        type: Number,
        optional: true
    },

    rolesArea: {
        type: String,
        label: "Role Area"
    },
    createdAt: {
        type: Date,
        optional:true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional:true,

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

Pos_Term.attachSchema(Pos_Term.schema);

export const Pos_TermReact = new Mongo.Collection('pos_termReact');
Pos_TermReact.schema = new SimpleSchema({
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

Pos_TermReact.attachSchema(Pos_TermReact.schema);