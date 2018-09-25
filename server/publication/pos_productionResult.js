import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_ProductionResultReact} from "../../imports/collection/posProductionResult";

Meteor.publish('Pos_ProductionResultReact', function () {
    if (this.userId) {
        return Pos_ProductionResultReact.find({});
    }
    return this.ready();

});
