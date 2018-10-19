import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_TableLocationReact} from "../../imports/collection/posTableLocation";

Meteor.publish('Pos_TableLocationReact', function () {
    if (this.userId) {
        return Pos_TableLocationReact.find({});
    }
    return this.ready();

});
