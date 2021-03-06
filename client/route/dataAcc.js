//function 
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js 
import '../../imports/ui/acc_journal/accJournal';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';

var accData = FlowRouter.group({
    prefix: '/acc-data',
    name: 'accData',
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['setting', 'super']})) {
            redirect('wb.home');
        }
    }]
});

// home
accData.route('/', {
    name: 'wb.homeData',
    title: "Home",
    action: function (query, params) {
        _Main('wb_home');
    }
});


import '../../imports/ui/report/accPaymentPrintA4/accPaymentPrintA4';

accData.route('/accPayment/print', {
    name: 'pos.accPayment-print',
    action: function (params, queryParams) {
        BlazeLayout.render('PrintLayout', {printLayout: 'acc_paymentPrintA4Report'});
    }

});


import '../../imports/ui/report/accFixedAssetSchedule/accFixedAssetSchedule';

accData.route('/accFixedAssetSchedule/print', {
    name: 'pos.accFixedAssetSchedule-print',
    action: function (params, queryParams) {
        BlazeLayout.render('PrintLayout', {printLayout: 'acc_fixedAssetScheduleReport'});
    }

});

// Journal
accData.route('/journal', {
    name: 'acc.journal',
    parent: 'wb.homeData',
    title: "Journal Entry",
    action: function (query, params) {
        _Main('acc_journal');
    }
});
accData.route('/journal/:journalId/edit', {
    name: 'acc.journalEdit',
    title: "Journal Entry Edit",
    parent: 'acc.journal',
    action: function (query, params) {
        _Main('acc_journal');
    }
});
accData.route('/journal/add', {
    name: 'acc.journalAdd',
    title: "Journal Entry Add",
    parent: 'acc.journal',
    action: function (query, params) {
        _Main('acc_journal');
    }
});
accData.route('/journal/:journalId/show', {
    name: 'acc.journalShow',
    title: "Journal Entry Show",
    parent: 'acc.journal',
    action: function (query, params) {
        _Main('acc_journal');
    }
});
import '../../imports/ui/acc_fixedAsset/accFixedAsset';

accData.route('/fixedAsset', {
    name: 'acc.fixedAsset',
    parent: 'wb.homeData',
    title: "Fixed Asset",
    action: function (query, params) {
        _Main('acc_fixedAsset');
    }
});
