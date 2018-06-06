export const Acc_AccountType = new Mongo.Collection('acc_accountType');

Acc_AccountType.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
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
    }
});

Acc_AccountType.attachSchema(Acc_AccountType.schema);