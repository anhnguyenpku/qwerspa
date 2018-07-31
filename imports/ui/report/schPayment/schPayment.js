import schPaymentReport from '/imports/vue/ui/report/schPayment';
import './schPayment.html';

let index = Template.sch_paymentReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schPaymentReport),
        component: schPaymentReport
    }).$mount('#schPayment-report')
});

index.onDestroyed(function () {
    $('.schPayment-report').remove();
});