import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_TermReact} from "../../imports/collection/posTerm";

Meteor.publish('Pos_TermReact', function () {
    if (this.userId) {
        return Pos_TermReact.find({});
    }
    return this.ready();

});
