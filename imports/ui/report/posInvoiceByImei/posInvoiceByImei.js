import posInvoiceByImeiReport from '/imports/vue/ui/report/posInvoiceByImei';
import './posInvoiceByImei.html';

let index = Template.pos_invoiceByImeiReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoiceByImeiReport),
        component: posInvoiceByImeiReport
    }).$mount('#posInvoiceByImei-report')
});

index.onDestroyed(function () {
    $('.posInvoiceByImei-report').remove();
});