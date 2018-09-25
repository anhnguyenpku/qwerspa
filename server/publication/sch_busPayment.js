import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_BusPaymentReact} from "../../imports/collection/schBusPayment";

Meteor.publish('Sch_BusPaymentReact', function () {
    if (this.userId) {
        return Sch_BusPaymentReact.find({});
    }
    return this.ready();

});
