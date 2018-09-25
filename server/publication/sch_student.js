import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_StudentReact} from "../../imports/collection/schStudent";

Meteor.publish('Sch_StudentReact', function () {
    if (this.userId) {
        return Sch_StudentReact.find({});
    }
    return this.ready();

});
