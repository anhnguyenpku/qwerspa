import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_VendorReact} from "../../imports/collection/posVendor";

Meteor.publish('Pos_VendorReact', function () {
    if (this.userId) {
        return Pos_VendorReact.find({});
    }
    return this.ready();

});
