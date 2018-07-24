//function 
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js

//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';

var wbData = FlowRouter.group({
    prefix: '/wb-data',
    name: 'wbData',
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['setting', 'super']})) {
            redirect('wb.home');
        }
    }]
});

let userProfile = FlowRouter.group({
    prefix: '/wb-user',
    name: 'wbUser',
    triggersEnter: [
        function (context, redirect) {
            if (!Meteor.userId()) {
                redirect('wb.home');
            }
        }
    ]
});
// home
wbData.route('/', {
    name: 'wb.homeData',
    title: "Home",
    action: function (query, params) {
        _Main('wb_home');
    }
});
// home2
//edit password
import "../../imports/ui/user/changePassword";

userProfile.route('/change-password', {
    name: 'wb.changePassword',
    parent: 'wb.homeData',
    title: 'Change Password',
    action: function (query, params) {
        _Main('wb_changePassword')
    }
});

