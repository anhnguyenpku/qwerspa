import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_BusReact} from "../../imports/collection/schBus";

Meteor.publish('Sch_BusReact', function () {
    if (this.userId) {
        return Sch_BusReact.find({});
    }
    return this.ready();

});
