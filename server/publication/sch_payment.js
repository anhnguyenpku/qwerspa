import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_PaymentReact} from "../../imports/collection/schPayment";

Meteor.publish('Sch_PaymentReact', function () {
    if (this.userId) {
        return Sch_PaymentReact.find({});
    }
    return this.ready();

});
