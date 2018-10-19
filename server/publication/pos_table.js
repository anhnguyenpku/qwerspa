import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_TableReact} from "../../imports/collection/posTable";

Meteor.publish('Pos_TableReact', function () {
    if (this.userId) {
        return Pos_TableReact.find({});
    }
    return this.ready();

});
