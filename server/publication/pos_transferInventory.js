import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_TransferInventoryReact} from "../../imports/collection/posTransferInventory";

Meteor.publish('Pos_TransferInventoryReact', function () {
    if (this.userId) {
        return Pos_TransferInventoryReact.find({});
    }
    return this.ready();

});
