import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_ProductReact} from "../../imports/collection/posProduct";

Meteor.publish('Pos_ProductReact', function () {
    if (this.userId) {
        return Pos_ProductReact.find({});
    }
    return this.ready();

});
