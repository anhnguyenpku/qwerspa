import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_ProgramReact} from "../../imports/collection/schProgram";

Meteor.publish('Sch_ProgramReact', function () {
    if (this.userId) {
        return Sch_ProgramReact.find({});
    }
    return this.ready();

});
