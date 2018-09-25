import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_RegisterReact} from "../../imports/collection/schRegister";

Meteor.publish('Sch_RegisterReact', function () {
    if (this.userId) {
        return Sch_RegisterReact.find({});
    }
    return this.ready();

});
