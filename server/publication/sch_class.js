import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_ClassReact} from "../../imports/collection/schClass";

Meteor.publish('Sch_ClassReact', function () {
    if (this.userId) {
        return Sch_ClassReact.find({});
    }
    return this.ready();

});
