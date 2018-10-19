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


var posSetting = FlowRouter.group({
    prefix: '/pos-setting',
    name: 'posSetting',
    title: "Setting",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }

        if (!CheckRoles({roles: ['remove', 'super']})) {
            Session.set("canRemove", true);
        } else {
            Session.set("canRemove", false);
        }
        if (!CheckRoles({roles: ['update', 'super']})) {
            Session.set("canUpdate", true);
        } else {
            Session.set("canUpdate", false);
        }
    }]
});

import '../../imports/ui/pos_category/posCategory';
import '../../imports/ui/pos_unit/posUnit';
import '../../imports/ui/pos_product/posProduct';
import '../../imports/ui/pos_term/posTerm';
import '../../imports/ui/pos_location/posLocation';
import '../../imports/ui/pos_Vendor/posVendor';
import '../../imports/ui/pos_Customer/posCustomer';
import '../../imports/ui/pos_transferInventory/posTransferInventory';
import '../../imports/ui/manage_module/manage_module';
import '../../imports/ui/pos_table/posTable';
import '../../imports/ui/pos_tableLocation/posTableLocation';

//Category
posSetting.route('/posCategory', {
    name: 'pos.category',
    title: "Category",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_category');
    }
});
//Table
posSetting.route('/posTable', {
    name: 'pos.table',
    title: "Table",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_table');
    }
});

//Table Location
posSetting.route('/posTableLocation', {
    name: 'pos.tableLocation',
    title: "Table Location",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_tableLocation');
    }
});

//Product
posSetting.route('/posProduct', {
    name: 'pos.product',
    title: "Product",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_product');
    }
});
//Term
posSetting.route('/posTerm', {
    name: 'pos.term',
    title: "Term",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_term');
    }
});
//Location
posSetting.route('/posLocation', {
    name: 'pos.location',
    title: "Location",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_location');
    }
});
//Transfer Inventory
posSetting.route('/posTransferInventory', {
    name: 'pos.transferInventory',
    title: "Transfer Inventory",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_transferInventory');
    }
});
//Unit
posSetting.route('/posUnit', {
    name: 'pos.unit',
    title: "Unit",
    parent: "wb.home",
    action: function (query, params) {
        _Main('pos_unit');
    }
});


var manageModule = FlowRouter.group({
    prefix: '/manage-module',
    name: 'manageModule',
    title: "Module",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['super']})) {
            redirect('wb.home');
        }
    }]
});

//manage_module
manageModule.route('/manageModule', {
    name: 'manage.module',
    title: "Manage Module",
    parent: "wb.home",
    action: function (query, params) {
        _Main('manage_module');
    }
});
