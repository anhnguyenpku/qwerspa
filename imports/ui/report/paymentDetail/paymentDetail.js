import './paymentDetail.html';
import PaymentDetail from '/imports/vue/ui/report/PaymentDetail.vue';

Template.wb_paymentDetailReport.onRendered(function () {
    new Vue({
        render: h => h(PaymentDetail)
    }).$mount('#payment-detail-report');
});

Template.wb_paymentDetailReport.onDestroyed(function () {
    $('.payment-detail-report').empty();
});