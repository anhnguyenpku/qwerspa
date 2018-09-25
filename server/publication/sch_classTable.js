import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_ClassTableReact} from "../../imports/collection/schClassTable";

Meteor.publish('Sch_ClassTableReact', function () {
    if (this.userId) {
        return Sch_ClassTableReact.find({});
    }
    return this.ready();

});
