import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_SubjectReact} from "../../imports/collection/schSubject";

Meteor.publish('Sch_SubjectReact', function () {
    if (this.userId) {
        return Sch_SubjectReact.find({});
    }
    return this.ready();

});
