import './debtPaymentSummary.html';
import DebtPaymentSummary from '/imports/vue/ui/report/DebtPaymentSummary.vue';

Template.wb_debtPaymentSummaryReport.onRendered(function () {
    new Vue({
        render: h => h(DebtPaymentSummary)
    }).$mount('#debt-payment-summary-report');
});

Template.wb_debtPaymentSummaryReport.onDestroyed(function () {
    $('.debt-payment-summary-report').empty();
});