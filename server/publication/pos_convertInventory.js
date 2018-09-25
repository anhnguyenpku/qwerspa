import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_ConvertInventoryReact} from "../../imports/collection/posConvertInventory";

Meteor.publish('Pos_ConvertInventoryReact', function () {
    if (this.userId) {
        return Pos_ConvertInventoryReact.find({});
    }
    return this.ready();

});
