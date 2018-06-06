export const LoginSetup = new Mongo.Collection('loginSetup');

LoginSetup.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    parentName: {
        type: String,
        label: "Name"
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
    }
});

LoginSetup.attachSchema(LoginSetup.schema);