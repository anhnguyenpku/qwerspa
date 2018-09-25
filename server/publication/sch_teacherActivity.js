import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_TeacherActivityReact} from "../../imports/collection/schTeacherActivity";

Meteor.publish('Sch_TeacherActivityReact', function () {
    if (this.userId) {
        return Sch_TeacherActivityReact.find({});
    }
    return this.ready();

});
