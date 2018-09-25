import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_CustomerReact} from "../../imports/collection/posCustomer";

Meteor.publish('Pos_CustomerReact', function () {
    if (this.userId) {
        return Pos_CustomerReact.find({});
    }
    return this.ready();

});
