import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_BusRegisterReact} from "../../imports/collection/schBusRegister";

Meteor.publish('Sch_BusRegisterReact', function () {
    if (this.userId) {
        return Sch_BusRegisterReact.find({});
    }
    return this.ready();

});
