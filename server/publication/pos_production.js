import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_ProductionReact} from "../../imports/collection/posProduction";

Meteor.publish('Pos_ProductionReact', function () {
    if (this.userId) {
        return Pos_ProductionReact.find({});
    }
    return this.ready();

});
