import './transferPaymentSummary.html';
import TransferPaymentSummary from '/imports/vue/ui/report/TransferPaymentSummary.vue';

Template.wb_transferPaymentSummaryReport.onRendered(function () {
    new Vue({
        render: h => h(TransferPaymentSummary)
    }).$mount('#transfer-payment-summary-report');
});

Template.wb_transferPaymentSummaryReport.onDestroyed(function () {
    $('.transfer-payment-summary-report').empty();
});