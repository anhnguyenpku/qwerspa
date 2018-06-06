import Trans from '../../../imports/api/methods/transaction';
import ValidateUser from "../../../both/validateMethods/validate-user";

Meteor.methods({
    giveMeTransactionObj(selector){
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        return Trans.giveMeTransactionObj(selector);
    },
    giveMeTransactionDetailAsArrayObject(selector){
        return Trans.giveMeTransactionDetailAsArrayObject(selector);
    }
});

