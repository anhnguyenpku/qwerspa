//import func
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//import template js here
import '../../imports/ui/home/home';
import '../../client/layout';
import '../../imports/ui/user/userSetting';
import '../../imports/ui/notFound/notFound';
import '../../imports/ui/area/area';
import '../../imports/ui/waterBillingSetup/waterBillingSetup';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';
import {_NoHeaderNoSideBar} from '../libs/_renderLayout';

//not found route
FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render('Wb_notFound');
    }
};


var wbSetting = FlowRouter.group({
    prefix: '/wb-setting',
    name: 'wbSetting',
    title: "Setting",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super', "controlUser"]})) {
            redirect('wb.home');
        }
    }]
});


wbSetting.route('/area', {
    name: 'wb.area',
    title: "Area",
    action: function (query, params) {
        _NoHeaderNoSideBar('waterBilling_area');
    }
});

FlowRouter.route('/', {
    name: 'wb.home',
    title: "Home",
    action: function (query, params) {
        _Main('wb_home');
    }
});
//User
wbSetting.route('/user-setting', {
    name: 'wb.userSetting',
    title: "User Setting",
    parent: "wb.home",
    action: function (query, params) {
        if (CheckRoles({roles: ['super', "controlUser"]})) {
            _Main('wb_userSetting');
        } else {
            FlowRouter.go('wb.home');
        }
    }
});
wbSetting.route('/user-setting/new', {
    name: 'wb.userAdd',
    title: "User Add",
    parent: "wb.userSetting",
    action: function (query, params) {
        if (CheckRoles({roles: ['super', "controlUser"]})) {

            _Main('wb_userAdd');
        } else {
            FlowRouter.go('wb.home')
        }
    }
});
wbSetting.route('/user-setting/:userId/edit', {
    name: 'wb.userSettingEdit',
    title: "User Setting Edit",
    parent: "wb.userSetting",
    action: function (query, params) {
        if (CheckRoles({roles: ['super', "controlUser"]})) {
            _Main('wb_userSettingEdit');
        } else {
            FlowRouter.go('wb.home');
        }
    }
});
//===================================================Route For Account==============================
import '../../imports/ui/acc_chartAccount/accChartAccount';


//Customer
wbSetting.route('/accChartAccount', {
    name: 'acc.accChartAccount',
    title: "Chart Account",
    parent: "wb.home",
    action: function (query, params) {
        _Main('acc_chartAccount');
    }
});

import '../../imports/ui/waterBillingSetup/waterBillingSetup';
//waterBillingSetup
wbSetting.route('/waterBillingSetup', {
    name: 'wb.waterBillingSetup',
    title: "Setup",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_waterBillingSetup');
    }
});