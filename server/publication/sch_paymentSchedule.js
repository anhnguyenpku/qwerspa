import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_PaymentScheduleReact} from "../../imports/collection/schPaymentSchedule";

Meteor.publish('Sch_PaymentScheduleReact', function () {
    if (this.userId) {
        return Sch_PaymentScheduleReact.find({});
    }
    return this.ready();

});
