import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_PositionReact} from "../../imports/collection/schPosition";

Meteor.publish('Sch_PositionReact', function () {
    if (this.userId) {
        return Sch_PositionReact.find({});
    }
    return this.ready();

});
