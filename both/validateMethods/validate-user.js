export default class ValidateUser{
    static ifUserNotSignedIn({msg}){
        if (!Meteor.userId()) {
            throw new Meteor.Error('You not login',
                `${msg}`);
        }
    }
}