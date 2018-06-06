//function 
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js 
import '../../imports/ui/meterReading/meterReading';
import '../../imports/ui/meterReadingJournal/meterReadingJournal';
import '../../imports/ui/print/meterReadingJournal/meterReadingJournal';
import '../../imports/ui/print/postedMeterReadingJournal/postedMeterReadingJournal';
import '../../imports/ui/meterChange/meterChange';
import '../../imports/ui/payment/payment';
import '../../imports/ui/import-data/import-data';
import '../../imports/ui/search/search';
import '../../imports/ui/user/changePassword';
import '../../imports/ui/requestUpdateJournalDetail/requestUpdateJournalDetail';
import '../../imports/ui/exportData/exportData';

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

let wbDebt = FlowRouter.group({
    prefix: '/wb-debt',
    name: 'wbDebt',
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['creditor','payment', 'super','admin']})) {
            redirect('wb.home');
        }
    }]
});

let userProfile = FlowRouter.group({
    prefix: '/wb-user',
    name: 'wbUser',
    triggersEnter: [
        function(context,redirect){
            if(!Meteor.userId()) {
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
userProfile.route('/change-password', {
    name: 'wb.changePassword',
    parent: 'wb.homeData',
    title: 'Change Password',
    action: function(query,params) {
        _Main('wb_changePassword')
    }
});
// meter reading
wbData.route('/meterReading', {
    name: 'wb.meterReading',
    parent: 'wb.homeData',
    title: "Meter Reading",
    action: function (query, params) {
        _Main('wb_meterReading');
    }
});
wbData.route('/meterReading/:meterReadingId/edit', {
    name: 'wb.meterReadingEdit',
    title: "Meter Reading Edit",
    parent: 'wb.meterReading',
    action: function (query, params) {
        _Main('wb_meterReadingEdit');
    }
});
wbData.route('/meterReading/add', {
    name: 'wb.meterReadingAdd',
    title: "Meter Reading Add",
    parent: 'wb.meterReading',
    action: function (query, params) {
        _Main('wb_meterReadingAdd');
    }
});


wbData.route('/meterReading/:meterReadingId/show', {
    name: 'wb.meterReadingShow',
    title: "Meter Reading Show",
    parent: 'wb.meterReading',
    action: function (query, params) {
        _Main('wb_meterReadingShow');
    }
});

wbData.route('/meterReadingJournal', {
    name: 'wb.meterReadingJournal',
    title: "Meter Reading Journal",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('Wb_meterReadingJournal');
    }
});
wbData.route('/meterReadingJournal/new', {
    name: 'wb.meterReadingJournalNew',
    parent: 'wb.meterReadingJournal',
    title: "Meter Reading Journal Add",
    action: function (query, params) {
        _Main('Wb_meterReadingJournalNew');
    }
});

wbData.route('/meterWritingJournal/:mrId', {
    name: 'wb.meterWritingJournal',
    title: "Meter Writing Journal",
    parent: 'wb.meterReadingJournal',
    action: function (query, params) {
        _Main('Wb_meterWritingJournal');
    }
});

wbData.route('/uploadMeterWritingJournal/:mrId', {
    name: 'wb.uploadMeterWritingJournal',
    title: "Upload Meter Writing Journal",
    parent: 'wb.meterReadingJournal',
    action: function (query, params) {
        _Main('Wb_uploadMeterWritingJournal');
    }
});

// end meter reading

//print meter reading journal
wbData.route('/print-mrj', {
    name: 'wb.printMeterReadingJournal',
    title: "Print Meter reading Journal",
    parent: 'wb.meterReadingJournal',
    action: function (query, params) {
        _Main('wb_printMeterReadingJournal');
    }
});
//print posted meter reading
wbData.route('/print-posted-mrj', {
    name: 'wb.postedPrintMeterReadingJournal',
    title: "Posted Print Meter Reading Journal",
    parent: 'wb.meterReadingJournal',
    action: function (query, params) {
        _Main('wb_postedPrintMeterReadingJournal');
    }
});
// meter change
wbData.route('/customer', {
    name: 'wb.meterChange',
    title: "Customer",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('wb_meterChange');
    }
});
//meter change component

wbData.route('/meter-change-component', {

    name: 'wb.meterChangeComponent',
    title: "Meter Change Component",
    parent: 'wb.meterChange',
    action: function (query, params) {
        _Main('wb_meterChangeComponent');
    }
});
//Payment Form
wbDebt.route('/payment', {
    name: 'wb.payment',
    title: "Payment",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('Wb_payment');
    }
});
wbDebt.route('/payment/new', {
    name: 'wb.paymentAdd',
    title: "Payment Add",
    parent: 'wb.payment',
    action: function (query, params) {
        _Main('wb_paymentAdd');
    }
});
wbDebt.route('/payment/:paymentId/edit', {
    name: 'wb.paymentEdit',
    title: "Payment Edit",
    parent: 'wb.payment',
    action: function (query, params) {
        _Main('wb_paymentEdit');
    }
});
wbData.route('/import-data', {
    name: 'wb.importData',
    title: "Import Data",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('wb_importData');
    }
});
wbData.route('/search', {
    name: 'wb.search',
    title: "Search",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('wb_search');
    }
});
wbData.route('/request-update', {
    name: 'wb.requestUpdateJournalDetail',
    title: "Request Update",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('wb_requestUpdateJournalDetail');
    }
});

wbDebt.route('/export-data', {
    name: 'wb.exportData',
    title: "Export Data",
    parent: 'wb.homeData',
    action: function (query, params) {
        _Main('wb_exportData');
    }
});