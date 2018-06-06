import MobileSync from '../../../imports/api/methods/mobileSync';
import ValidateUser from "../../../both/validateMethods/validate-user";

Meteor.methods({
    mobileSync_insert(doc){
        return MobileSync.insert(doc);
    },
    mobileSync_readBy(id,selector) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to update mobile sync'});
        return MobileSync.update(id, selector);
    }
});