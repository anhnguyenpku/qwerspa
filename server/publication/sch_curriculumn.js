import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_CiriculumnReact} from "../../imports/collection/schCiriculumn";

Meteor.publish('Sch_CiriculumnReact', function () {
    if (this.userId) {
        return Sch_CiriculumnReact.find({});
    }
    return this.ready();

});
