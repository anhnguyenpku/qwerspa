import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Pos_BillReact} from "../../imports/collection/posBill";

Meteor.publish('Pos_BillReact', function () {
    if (this.userId) {
        return Pos_BillReact.find({});
    }
    return this.ready();

});
