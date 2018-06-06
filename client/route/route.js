//function
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js
import '../../imports/ui/report/customer/customer';
import '../../imports/ui/report/sale/sale';
import '../../imports/ui/report/meterChange/meterChange';
import '../../imports/ui/report/payment/payment';
import '../../imports/ui/report/unpaidCustomer/unpaidCustomer';
import '../../imports/ui/report/unpaidCustomerExpire/unpaidCustomerExpire';
import '../../imports/ui/report/unpaidCustomerBlockExpire/unpaidCustomerBlockExpire';
import '../../imports/ui/report/customUnpaidCustomer/customUnpaidCustomer';
import '../../imports/ui/report/paymentSummary/paymentSummary';
import '../../imports/ui/report/tellerPaymentSummary/tellerPaymentSummary';
import '../../imports/ui/report/debtPaymentSummary/debtPaymentSummary';
import '../../imports/ui/report/transferPaymentSummary/transferPaymentSummary';
import '../../imports/ui/report/paymentDetail/paymentDetail';
import '../../imports/ui/report/total-appellate/total-appellate';
import '../../imports/ui/report/blockSummary/blockSummary';
import '../../imports/ui/report/blockSummaryUnpaidExpire/blockSummaryUnpaidExpire';
import '../../imports/ui/report/daikaom/daikaom';
import '../../imports/ui/report/meterReadingJournalThreeMonth/meterReadingJournalThreeMonth';
import '../../imports/ui/report/meterReadingJournalSixMonth/meterReadingJournalSixMonth';
import '../../imports/ui/invoiceTransfer/invoiceTransfer';
import '../../imports/ui/GEO/geo-village';
import '../../imports/ui/mobileSyncedNotification/mobileSyncedNotification';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';

let wbReport = FlowRouter.group({
    prefix: '/wb-report',
    name: 'wbReport',
    title: "Home",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }
    }]
});

//Please use ths group for debt report
let wbDebtReport = FlowRouter.group({
    prefix: '/wb-debt-report',
    name: 'wbReport',
    title: "Home",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'super', 'creditor', 'payment']})) {
            redirect('wb.home');
        }
    }]
});


wbDebtReport.route('/invoice-transfer', {
    name: 'wb.invoiceTransfer',
    title: 'Invoice Transfer',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_invoiceTransfer');
    }
});

wbDebtReport.route('/payment-summary', {
    name: 'wb.paymentSummary',
    title: 'Payment Summary',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_paymentSummaryReport');
    }
});
wbReport.route('/teller-payment-summary', {
    name: 'wb.tellerPaymentSummary',
    title: 'Teller Payment Summary',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_tellerPaymentSummaryReport');
    }
});
wbDebtReport.route('/debt-payment-summary', {
    name: 'wb.debtPaymentSummary',
    title: 'Debt Payment Summary',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_debtPaymentSummaryReport');
    }
});
wbDebtReport.route('/transfer-payment-summary', {
    name: 'wb.transferPaymentSummary',
    title: 'Transfer Payment Summary',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_transferPaymentSummaryReport');
    }
});

wbDebtReport.route('/payment-detail', {
    name: 'wb.paymentDetail',
    title: 'Payment Detail',
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_paymentDetailReport');
    }
});
wbDebtReport.route('/unpaidCustomer', {
    name: 'wb.unpaidCustomerReport',
    title: "UnPaid Customer Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_unpaidCustomerReport');
    }
});
wbDebtReport.route('/unpaidCustomerExpire', {
    name: 'wb.unpaidCustomerExpireReport',
    title: "UnPaid Customer Expire Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_unpaidCustomerExpireReport');
    }
});
wbDebtReport.route('/unpaidCustomerBlockExpire', {
    name: 'wb.unpaidCustomerBlockExpireReport',
    title: "UnPaid Customer Block Expire Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_unpaidCustomerBlockExpireReport');
    }
});
wbDebtReport.route('/custom-unpaid-customer', {
    name: 'wb.customUnpaidCustomerReport',
    title: "UnPaid Customer Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_customUnpaidCustomerReport');
    }
});


wbReport.route('/', {
    name: 'wb.home',
    title: "Home",
    action: function (query, params) {
        _Main('wb_home');
    }

});

wbReport.route('/customer', {
    name: 'wb.customerReport',
    title: "Customer",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_customerReport');
    }

});
wbReport.route('/sale', {
    name: 'wb.saleReport',
    title: "Sale",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_saleReport');
    }
});
wbReport.route('/meterChange', {
    name: 'wb.meterChangeReport',
    title: "Meter Change",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_meterChangeReport');
    }
});
wbReport.route('/payment', {
    name: 'wb.paymentReport',
    title: "Payment",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_paymentReport');
    }
});

wbReport.route('/totalAppellate', {
    name: 'wb.totalAppellateReport',
    title: "Conclude Appellate Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_total_appellateReport');
    }
});

wbReport.route('/blockSummary', {
    name: 'wb.blockSummaryReport',
    title: "Block Summary Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_blockSummaryReport');
    }
});

wbReport.route('/daikaom', {
    name: 'wb.daikaomReport',
    title: "Daikaom Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_daikaomReport');
    }
});
wbReport.route('/geo-village', {
    name: 'wb.geoVillage',
    title: "GEO Village",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_geoVillage');
    }
});
wbReport.route('/meterReadingJournalThreeMonthReport', {
    name: 'wb.meterReadingJournalThreeMonthReport',
    title: "Meter Reading Journal Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_meterReadingJournalThreeMonthReport');
    }
});
wbReport.route('/mobile-synced-notification', {
    name: 'wb.mobileSyncedNotification',
    title: "Mobile Synced Notification",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_mobileSyncedNotification');
    }
});

wbReport.route('/meterReadingJournalSixMonthReport', {
    name: 'wb.meterReadingJournalSixMonthReport',
    title: "Meter Reading Journal Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_meterReadingJournalSixMonthReport');
    }
});


wbReport.route('/blockSummaryUnpaidExpire', {
    name: 'wb.blockSummaryUnpaidExpireReport',
    title: "Block Summary Unpaid Expire Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('wb_blockSummaryUnpaidExpireReport');
    }
});
