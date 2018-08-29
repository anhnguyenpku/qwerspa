import accPaymentPrintA4Report from '/imports/vue/ui/report/accPaymentPrintA4';
import './accPaymentPrintA4.html';

let index = Template.acc_paymentPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(accPaymentPrintA4Report),
        component: accPaymentPrintA4Report
    }).$mount('#accPaymentPrintA4-report')
});

index.onDestroyed(function () {
    $('.accPaymentPrintA4-report').remove();
});