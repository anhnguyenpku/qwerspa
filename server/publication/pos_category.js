import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_CategoryReact} from "../../imports/collection/posCategory";

Meteor.publish('Pos_CategoryReact', function () {
    if (this.userId) {
        return Pos_CategoryReact.find({});
    }
    return this.ready();

});
