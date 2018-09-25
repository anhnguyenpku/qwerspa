import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_SaleOrderReact} from "../../imports/collection/posSaleOrder";

Meteor.publish('Pos_SaleOrderReact', function () {
    if (this.userId) {
        return Pos_SaleOrderReact.find({});
    }
    return this.ready();

});
