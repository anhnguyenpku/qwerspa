import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_JournalReact} from "../../imports/collection/accJournal";

Meteor.publish('Acc_JournalReact', function () {
    if (this.userId) {
        return Acc_JournalReact.find({});
    }
    return this.ready();

});
