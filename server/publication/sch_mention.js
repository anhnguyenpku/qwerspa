import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_MentionReact} from "../../imports/collection/schMention";

Meteor.publish('Sch_MentionReact', function () {
    if (this.userId) {
        return Sch_MentionReact.find({});
    }
    return this.ready();

});
