import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_LocationReact} from "../../imports/collection/posLocation";

Meteor.publish('Pos_LocationReact', function () {
    if (this.userId) {
        return Pos_LocationReact.find({});
    }
    return this.ready();

});
