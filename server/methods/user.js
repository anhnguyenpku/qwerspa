import {Meteor} from 'meteor/meteor';
import 'lodash';

Meteor.methods({
    getRolesBranchList() {
        let list = [{label: 'Battambang', value: '02'}];
        return list
    },
    _getUser({_id}) {
        Meteor._sleepForMs(500);
        if (Meteor.userId()) {
            let user = Meteor.users.findOne({_id});
            if (user.emails.length > 0) {
                user.email = user.emails[0].address;
            }
            user.password = 'oldPassword';
            user.confirmPassword = 'oldPassword';
            if (user.roles) {
                for (let k in user.roles) {
                    if (user.roles[k]) {
                        user.roles = user.roles[k];
                    }
                }
            }
            return user;
        }
        return []
    },
    checkUserCurrentPassword(user, password) {
        let currentUser = Meteor.users.findOne({_id: user._id});
        return Accounts._checkPassword(currentUser, password);
    },
    updateFullName(fullName) {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {fullName: fullName}});
    }
});
