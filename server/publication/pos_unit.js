import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_UnitReact} from "../../imports/collection/posUnit";

Meteor.publish('Pos_UnitReact', function () {
    if (this.userId) {
        return Pos_UnitReact.find({});
    }
    return this.ready();

});
