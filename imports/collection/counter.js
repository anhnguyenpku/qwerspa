export const CounterCollection = new Mongo.Collection('counterCollection');

CounterCollection.schema = new SimpleSchema({
    type: {
        type: String, //customer , receivePayment,
    },
    sequence: {
        type: Number,
    },
    rolesArea: {
        type: String
    }
});