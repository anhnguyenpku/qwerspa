import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_TeacherReact} from "../../imports/collection/schTeacher";

Meteor.publish('Sch_TeacherReact', function () {
    if (this.userId) {
        return Sch_TeacherReact.find({});
    }
    return this.ready();

});
