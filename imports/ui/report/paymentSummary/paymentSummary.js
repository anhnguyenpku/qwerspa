import './paymentSummary.html';
import PaymentSummary from '/imports/vue/ui/report/PaymentSummary.vue';

Template.wb_paymentSummaryReport.onRendered(function () {
    new Vue({
        render: h => h(PaymentSummary)
    }).$mount('#payment-summary-report');
});

Template.wb_paymentSummaryReport.onDestroyed(function () {
    $('.payment-summary-report').empty();
});