import PaymentReport from '/imports/vue/ui/report/Payment.vue';
import './payment.html';
let index = Template.wb_paymentReport;
index.onRendered(function () {
    new Vue({
        render: h => h(PaymentReport),
        component: PaymentReport
    }).$mount('#payment-report')
});

index.onDestroyed(function () {
    $('.payment-report').remove();
});