//import func
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//import template js here
import '../../imports/ui/home/home';
import '../../imports/ui/generalinformation/generalinformation';
import '../../imports/ui/employee/employee';
import '../../imports/ui/benchmark/benchmark';
import '../../imports/ui/benchmarkSum/benchmarkSum';
import '../../imports/ui/benchmarking/benchmarking';
import '../../imports/ui/customer/customer';
import '../../imports/ui/customerType/customerType';
import '../../client/layout';
import '../../imports/ui/user/userSetting';
import '../../imports/ui/meter/meter';
import '../../imports/ui/notFound/notFound';
import '../../imports/ui/meterType/meterType';
//import '../../imports/ui/settingPrice/settingPrice';
import '../../imports/ui/block/block';
import '../../imports/ui/category/category';
import '../../imports/ui/class/class';
import '../../imports/ui/district/district';
import '../../imports/ui/operationCode/operationCode';
import '../../imports/ui/position/position';
import '../../imports/ui/quartier/quartier';
import '../../imports/ui/attension/attension';
import '../../imports/ui/referenceType/referenceType';
import '../../imports/ui/reference/reference';
import '../../imports/ui/tariff/tariff';
import '../../imports/ui/activity/activity';
import '../../imports/ui/changeBlock/changeBlock';
import '../../imports/ui/meterReadingJournal/meterReadingJournal';
import '../../imports/ui/area/area';
import '../../imports/ui/waterBillingSetup/waterBillingSetup';
import '../../imports/ui/saving/saving';
import '../../imports/ui/agent/agent';
import '../../imports/ui/meterCode/meterCode';
import '../../imports/ui/description/description';


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
FlowRouter.route('/generalinformation', {
    name: 'wb.generalinformation',
    title: "General Information",
    action: function (query, params) {
        _Main('wb_generalinformation');
    }
});

FlowRouter.route('/employee', {
    name: 'wb.employee',
    title: "Employee",
    action: function (query, params) {
        _Main('wb_employee');
    }
});
FlowRouter.route('/benchmark', {
    name: 'wb.benchmark',
    title: "Benchmark",
    action: function (query, params) {
        _Main('wb_benchmark');
    }
});
FlowRouter.route('/benchmarkSum', {
    name: 'wb.benchmarkSum',
    title: "Benchmark Sum",
    action: function (query, params) {
        _Main('wb_benchmarkSum');
    }
});

// meter change
FlowRouter.route('/benchmarking', {
    name: 'wb.benchmarking',
    title: "Benchmarking",
    action: function (query, params) {
        _Main('wb_benchmarking');
    }
});
//waterBillingSetup
FlowRouter.route('/waterBillingSetup', {
    name: 'wb.waterBillingSetup',
    title: "Water Billing Setup",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_waterBillingSetup');
    }
});
//Customer
wbSetting.route('/customer', {
    name: 'wb.customer',
    title: "Customer",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_customer');
    }
});

wbSetting.route('/customer/add', {
    name: 'wb.customerAdd',
    parent: "wb.meterChange",
    title: "Customer Add",
    action: function (query, params) {
        _Main('wb_customerAdd');
    }
});

wbSetting.route('/customer/:customerId/edit', {
    name: 'wb.customerEdit',
    parent: "wb.meterChange",
    title: "Customer Edit",
    action: function (query, params) {
        _Main('wb_customerEdit');
    }
});

wbSetting.route('/customer/:customerId/detail', {
    name: 'wb.customerDetail',
    title: "Customer Detail",
    parent: "wb.meterChange",
    action: function (params, query) {
        _Main('wb_customerDetail');
    }
});
//Saving
wbSetting.route('/customer/:customerId/saving', {
    name: 'wb.customerSaving',
    title: "Customer Saving",
    parent: "wb.customerDetail",
    action: function (query, params) {
        _Main('wb_customerSaving');
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

//Customer Type
wbSetting.route('/customerType', {
    name: 'wb.customerType',
    title: "Customer Type",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_customerType');
    }
});
wbSetting.route('/customerType/:customerTypeId/edit', {
    name: 'wb.customerTypeEdit',
    title: "Customer Type Edit",
    parent: "wb.customerType",
    action: function (query, params) {
        _Main('wb_customerTypeEdit');
    }
});

//Meter
wbSetting.route('/meter', {
    name: 'wb.meter',
    title: "Meter",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_meter');
    }
});

//Block
wbSetting.route('/block', {
    name: 'wb.block',
    title: "Block",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_block');
    }
});
wbSetting.route('/block/:blockId/edit', {
    name: 'wb.blockEdit',
    title: "Block Edit",
    parent: "wb.block",
    action: function (query, params) {
        _Main('wb_blockEdit');
    }
});

wbSetting.route('/block/add', {
    name: 'wb.blockAdd',
    title: "Block Add",
    parent: "wb.block",
    action: function (query, params) {
        _Main('wb_blockAdd');
    }
});

//Block
wbSetting.route('/category', {
    name: 'wb.category',
    title: "Category",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_category');
    }
});
wbSetting.route('/category/:categoryId/edit', {
    name: 'wb.categoryEdit',
    title: "Category Edit",
    parent: "wb.category",
    action: function (query, params) {
        _Main('wb_categoryEdit');
    }
});

//Class
wbSetting.route('/class', {
    name: 'wb.class',
    title: "Class",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_class');
    }
});
wbSetting.route('/class/:classId/edit', {
    name: 'wb.classEdit',
    title: "Class Edit",
    parent: "wb.class",
    action: function (query, params) {
        _Main('wb_classEdit');
    }
});
//Class
wbSetting.route('/district', {
    name: 'wb.district',
    title: "District",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_district');
    }
});
wbSetting.route('/district/:districtId/edit', {
    name: 'wb.districtEdit',
    title: "District Edit",
    parent: "wb.district",
    action: function (query, params) {
        _Main('wb_districtEdit');
    }
});
//operationCode
wbSetting.route('/operationCode', {
    name: 'wb.operationCode',
    title: "Operation Code",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_operationCode');
    }
});
wbSetting.route('/operationCode/:operationCodeId/edit', {
    name: 'wb.operationCodeEdit',
    title: "Operation Code Edit",
    parent: "wb.operationCode",
    action: function (query, params) {
        _Main('wb_operationCodeEdit');
    }
});
//position
wbSetting.route('/position', {
    name: 'wb.position',
    title: "Position",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_position');
    }
});
wbSetting.route('/position/:positionId/edit', {
    name: 'wb.positionEdit',
    parent: "wb.position",
    title: "Position Edit",
    action: function (query, params) {
        _Main('wb_positionEdit');
    }
});
//quartier
wbSetting.route('/quartier', {
    name: 'wb.quartier',
    title: "Quartier",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_quartier');
    }
});
wbSetting.route('/quartier/:quartierId/edit', {
    name: 'wb.quartierEdit',
    parent: "wb.quartier",
    title: "Quartier Edit",
    action: function (query, params) {
        _Main('wb_quartierEdit');
    }
});
wbSetting.route('/quartier/add', {
    name: 'wb.quartierAdd',
    title: "Quartier Add",
    parent: "wb.quartier",
    action: function (query, params) {
        _Main('wb_quartierAdd');
    }
});
//attension
wbSetting.route('/attension', {
    name: 'wb.attension',
    title: "Attension",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_attension');
    }
});
wbSetting.route('/attension/:attensionId/edit', {
    name: 'wb.attensionEdit',
    parent: "wb.attension",
    title: "Attension Edit",
    action: function (query, params) {
        _Main('wb_attensionEdit');
    }
});
//referenceType
wbSetting.route('/referenceType', {
    name: 'wb.referenceType',
    title: "Reference Type",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_referenceType');
    }
});
wbSetting.route('/referenceType/:referenceTypeId/edit', {
    name: 'wb.referenceTypeEdit',
    parent: "wb.referenceType",
    title: "Reference Type Edit",
    action: function (query, params) {
        _Main('wb_referenceTypeEdit');
    }
});
//reference
wbSetting.route('/reference', {
    name: 'wb.reference',
    parent: "wb.home",
    title: "Reference",
    action: function (query, params) {
        _Main('wb_reference');
    }
});
wbSetting.route('/reference/:referenceId/edit', {
    name: 'wb.referenceEdit',
    parent: "wb.reference",
    title: "Reference Edit",
    action: function (query, params) {
        _Main('wb_referenceEdit');
    }
});
wbSetting.route('/reference/add', {
    name: 'wb.referenceAdd',
    title: "Reference Add",
    parent: "wb.reference",
    action: function (query, params) {
        _Main('wb_referenceAdd');
    }
});

//tariff
wbSetting.route('/tariff', {
    name: 'wb.tariff',
    parent: "wb.home",
    title: "Tariff",
    action: function (query, params) {
        _Main('wb_tariff');
    }
});
wbSetting.route('/tariff/add', {
    name: 'wb.tariffAdd',
    title: "Tariff Add",
    parent: "wb.tariff",
    action: function (query, params) {
        _Main('wb_tariffAdd');
    }
});
wbSetting.route('/tariff/:tariffId/edit', {
    name: 'wb.tariffEdit',
    title: "Tariff Edit",
    parent: "wb.tariff",
    action: function (query, params) {
        _Main('wb_tariffEdit');
    }
});
wbSetting.route('/activity', {
    name: 'wb.activity',
    parent: "wb.home",
    title: "Activity",
    action: function (query, params) {
        _Main('wb_activity');
    }
});
wbSetting.route('/activity/:id/edit', {
    name: 'wb.activityEdit',
    title: "Activity Edit",
    parent: "wb.activity",
    action: function (query, params) {
        _Main('Wb_activityEdit');
    }
});
wbSetting.route('/meter', {
    name: 'wb.meter',
    title: "Meter",
    parent: "wb.home",
    action: function (query, params) {
        _Main('Wb_meter');
    }
});
wbSetting.route('/meterType', {
    name: 'wb.meterType',
    parent: "wb.home",
    title: "Meter Type",
    action: function (query, params) {
        _Main('Wb_meterType');
    }
});
/*
wbSetting.route('/setting-price', {
    name: 'wb.setting-price',
    title: "Setting Price",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_settingPrice');
    }
});
wbSetting.route('/setting-price/new', {
    name: 'wb.setting-price-new',
    title: "Setting Price Add",
    parent: "wb.setting-price",
    action: function (query, params) {
        _Main('wb_settingPriceAdd');
    }
});
wbSetting.route('/setting-price/:settingPriceId/edit', {
    name: 'wb.setting-price-edit',
    title: "Setting Price Edit",
    parent: "wb.setting-price",
    action: function (query, params) {
        _Main('wb_settingPriceEdit');
    }
});*/


//Change Block

wbSetting.route('/changeBlock', {
    name: 'wb.changeBlock',
    title: "Change Block",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_changeBlock');
    }
});

wbSetting.route('/changeBlock/:customerId/byCustomerId', {
    name: 'wb.changeBlockByCustomerId',
    title: "Change Block",
    parent: "wb.meterChange",
    action: function (query, params) {
        _Main('wb_changeBlock');
    }
});
wbSetting.route('/changeBlock/add', {
    name: 'wb.changeBlock-new',
    title: "Change Block Add",
    parent: "wb.changeBlock",
    action: function (query, params) {
        _Main('wb_changeBlockAdd');
    }
});
wbSetting.route('/changeBlock/:changeBlockId/edit', {
    name: 'wb.changeBlock-edit',
    title: "Change Block Edit",
    parent: "wb.changeBlock",
    action: function (query, params) {
        _Main('wb_changeBlockEdit');
    }
});
wbSetting.route('/agent', {
    name: 'wb.agent',
    title: "Agent",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_agent');
    }
});
wbSetting.route('/meterCode', {
    name: 'wb.meterCode',
    title: "Meter Code",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_meterCode');
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
//using for modify description on mobile
wbSetting.route('/description', {
    name: 'wb.description',
    title: "Description",
    parent: "wb.home",
    action: function (query, params) {
        _Main('wb_description');
    }
});