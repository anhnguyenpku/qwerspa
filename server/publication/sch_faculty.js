import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_FacultyReact} from "../../imports/collection/schFaculty";

Meteor.publish('Sch_FacultyReact', function () {
    if (this.userId) {
        return Sch_FacultyReact.find({});
    }
    return this.ready();

});
