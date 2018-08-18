import schBusPaymentPrintA4Report from '/imports/vue/ui/report/schBusPaymentPrintA4';
import './schBusPaymentPrintA4.html';

let index = Template.sch_busPaymentPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusPaymentPrintA4Report),
        component: schBusPaymentPrintA4Report
    }).$mount('#schBusPaymentPrintA4-report')
});

index.onDestroyed(function () {
    $('.schBusPaymentPrintA4-report').remove();
});