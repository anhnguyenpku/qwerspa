import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_ClosingEntryReact} from "../../imports/collection/accClosingEntry";

Meteor.publish('Acc_ClosingEntryReact', function () {
    if (this.userId) {
        return Acc_ClosingEntryReact.find({});
    }
    return this.ready();

});
