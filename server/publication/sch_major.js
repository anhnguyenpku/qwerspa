import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_MajorReact} from "../../imports/collection/schMajor";

Meteor.publish('Sch_MajorReact', function () {
    if (this.userId) {
        return Sch_MajorReact.find({});
    }
    return this.ready();

});
