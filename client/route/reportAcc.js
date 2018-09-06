//function
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js

import '../../imports/ui/report/journal/journal';
import '../../imports/ui/report/ledger/ledger';
import '../../imports/ui/report/transactionDetail/transactionDetail';
import '../../imports/ui/report/trialBalance/trialBalance';
import '../../imports/ui/report/accountList/accountList';
import '../../imports/ui/report/balanceSheet/balanceSheet';
import '../../imports/ui/report/profitLost/profitLost';
import '../../imports/ui/report/currencyClosing/currencyClosing';
import '../../imports/ui/report/accFixedAsset/accFixedAsset';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';
import {_NoHeaderNoSideBar} from '../libs/_renderLayout';

let accReport = FlowRouter.group({
    prefix: '/acc-report',
    name: 'accReport',
    title: "Home",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }
    }]
});

let accReportNewPage = FlowRouter.group({
    prefix: '/acc-report',
    name: 'accReport',
    title: "Home"/*,
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }
    }]*/
});

accReport.route('/journalReport', {
    name: 'acc.journalReport',
    title: "Journal",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_journalReport');
    }

});
accReport.route('/ledgerReport', {
    name: 'acc.ledgerReport',
    title: "Ledger",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_ledgerReport');
    }

});

accReport.route('/transactionDetailReport', {
    name: 'acc.transactionDetailReport',
    title: "Transaction Detail",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_transactionDetailReport');
    }

});

accReport.route('/trialBalanceReport', {
    name: 'acc.trialBalanceReport',
    title: "Trial Balance",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_trialBalanceReport');
    }

});

accReport.route('/accountListReport', {
    name: 'acc.accountListReport',
    title: "Account List",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_accountListReport');
    }

});
accReport.route('/balanceSheetReport', {
    name: 'acc.balanceSheetReport',
    title: "Balance Sheet",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_balanceSheetReport');
    }

});

accReport.route('/profitLostReport', {
    name: 'acc.profitLostReport',
    title: "Profit Lost",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_profitLostReport');
    }

});

accReport.route('/fixedAsset', {
    name: 'acc.fixedAssetReport',
    title: "Fixed Asset",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('acc_fixedAssetReport');
    }

});


accReportNewPage.route('/currencyClosingReport', {
    name: 'acc.currencyClosingReport',
    title: "Closing Currency",
    parent: 'wb.home',
    action: function (query, params) {
        _NoHeaderNoSideBar('acc_currencyClosingReport');
    }

});
