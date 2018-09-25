import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_BusStopReact} from "../../imports/collection/schBusStop";

Meteor.publish('Sch_BusStopReact', function () {
    if (this.userId) {
        return Sch_BusStopReact.find({});
    }
    return this.ready();

});
