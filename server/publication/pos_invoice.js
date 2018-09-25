import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_InvoiceReact} from "../../imports/collection/posInvoice";

Meteor.publish('Pos_InvoiceReact', function () {
    if (this.userId) {
        return Pos_InvoiceReact.find({});
    }
    return this.ready();

});
