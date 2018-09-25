import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_TimeReact} from "../../imports/collection/schTime";

Meteor.publish('Sch_TimeReact', function () {
    if (this.userId) {
        return Sch_TimeReact.find({});
    }
    return this.ready();

});
