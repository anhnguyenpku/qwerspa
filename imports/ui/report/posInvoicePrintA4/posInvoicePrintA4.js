import posInvoicePrintA4Report from '/imports/vue/ui/report/posInvoicePrintA4';
import './posInvoicePrintA4.html';

let index = Template.pos_invoicePrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoicePrintA4Report),
        component: posInvoicePrintA4Report
    }).$mount('#posInvoicePrintA4-report')
});

index.onDestroyed(function () {
    $('.posInvoicePrintA4-report').remove();
});