import './tellerPaymentSummary.html';
import TellerPaymentSummary from '/imports/vue/ui/report/TellerPaymentSummary.vue';

Template.wb_tellerPaymentSummaryReport.onRendered(function () {
    new Vue({
        render: h => h(TellerPaymentSummary)
    }).$mount('#teller-payment-summary-report');
});

Template.wb_tellerPaymentSummaryReport.onDestroyed(function () {
    $('.teller-payment-summary-report').empty();
});