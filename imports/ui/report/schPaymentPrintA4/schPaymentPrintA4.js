import schPaymentPrintA4Report from '/imports/vue/ui/report/schPaymentPrintA4';
import './schPaymentPrintA4.html';

let index = Template.sch_paymentPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(schPaymentPrintA4Report),
        component: schPaymentPrintA4Report
    }).$mount('#schPaymentPrintA4-report')
});

index.onDestroyed(function () {
    $('.schPaymentPrintA4-report').remove();
});