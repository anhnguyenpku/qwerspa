import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_ExchangeReact} from "../../imports/collection/accExchange";

Meteor.publish('Acc_ExchangeReact', function () {
    if (this.userId) {
        return Acc_ExchangeReact.find({});
    }
    return this.ready();

});
