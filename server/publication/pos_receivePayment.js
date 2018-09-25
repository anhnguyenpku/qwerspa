import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_ReceivePaymentReact} from "../../imports/collection/posReceivePayment";

Meteor.publish('Pos_ReceivePaymentReact', function () {
    if (this.userId) {
        return Pos_ReceivePaymentReact.find({});
    }
    return this.ready();

});
