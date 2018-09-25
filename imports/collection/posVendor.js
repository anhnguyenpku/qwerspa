export const Pos_Vendor = new Mongo.Collection('pos_vendor');

Pos_Vendor.schema = new SimpleSchema({

    name: {
        type: String,
        label: "Name /Company",
        index:true
    },
    khName: {
        type: String,
        label: "Khmer Name/Company",
        optional: true
    },
    address: {
        type: String,
        label: "Address",
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    phoneNumber: {
        type: String,
        optional: true
    },
    termId: {
        type: String,
        optional: true
    },
    openingBalance: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    accountNo: {
        type: String,
        optional: true
    },
    businessNo: {
        type: String,
        optional: true
    },
    note: {
        type: String,
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
    billNumber: {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        },
        index:true
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

Pos_Vendor.attachSchema(Pos_Vendor.schema);

export const Pos_VendorReact = new Mongo.Collection('pos_vendorReact');
Pos_VendorReact.schema = new SimpleSchema({
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

Pos_VendorReact.attachSchema(Pos_VendorReact.schema);