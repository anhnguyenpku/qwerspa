import schBusPaymentReport from '/imports/vue/ui/report/schBusPayment';
import './schBusPayment.html';

let index = Template.sch_busPaymentReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusPaymentReport),
        component: schBusPaymentReport
    }).$mount('#schBusPayment-report')
});

index.onDestroyed(function () {
    $('.schBusPayment-report').remove();
});