//import func
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//import template js here
import '../../imports/ui/home/home';

import '../../client/layout';
import '../../imports/ui/user/userSetting';

import '../../imports/ui/notFound/notFound';


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


var accSetting = FlowRouter.group({
    prefix: '/acc-setting',
    name: 'accSetting',
    title: "Setting",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }
    }]
});

import '../../imports/ui/acc_chartAccount/accChartAccount';

//Customer
accSetting.route('/accChartAccount', {
    name: 'acc.chartAccount',
    title: "Chart Account",
    parent: "wb.home",
    action: function (query, params) {
        _Main('acc_chartAccount');
    }
});


import '../../imports/ui/acc_exchange/accExchange';

//Customer
accSetting.route('/accExchange', {
    name: 'acc.exchange',
    title: "Exchange",
    parent: "wb.home",
    action: function (query, params) {
        _Main('acc_exchange');
    }
});

import '../../imports/ui/acc_closingEntry/accClosingEntry';
//Customer
accSetting.route('/accClosingEntry', {
    name: 'acc.closingEntry',
    title: "Closing Entry",
    parent: "wb.home",
    action: function (query, params) {
        _Main('acc_closingEntry');
    }
});