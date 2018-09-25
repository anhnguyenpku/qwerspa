import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_ActivityReact} from "../../imports/collection/schActivity";

Meteor.publish('Sch_ActivityReact', function () {
    if (this.userId) {
        return Sch_ActivityReact.find({});
    }
    return this.ready();

});
