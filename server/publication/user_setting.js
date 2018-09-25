import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {UserSchemaReact} from "../../imports/collection/userSchema";

Meteor.publish('UserSchemaReact', function () {
    if (this.userId) {
        return UserSchemaReact.find({});
    }
    return this.ready();

});
