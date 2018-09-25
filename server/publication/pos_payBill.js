import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_PayBillReact} from "../../imports/collection/posPayBill";

Meteor.publish('Pos_PayBillReact', function () {
    if (this.userId) {
        return Pos_PayBillReact.find({});
    }
    return this.ready();

});
