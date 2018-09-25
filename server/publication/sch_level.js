import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_LevelReact} from "../../imports/collection/schLevel";

Meteor.publish('Sch_LevelReact', function () {
    if (this.userId) {
        return Sch_LevelReact.find({});
    }
    return this.ready();

});
