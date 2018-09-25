import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_FixedAssetReact} from "../../imports/collection/accFixedAsset";

Meteor.publish('Acc_FixedAssetReact', function () {
    if (this.userId) {
        return Acc_FixedAssetReact.find({});
    }
    return this.ready();

});
