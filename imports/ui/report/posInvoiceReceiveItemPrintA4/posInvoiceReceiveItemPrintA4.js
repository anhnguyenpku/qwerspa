import posInvoiceReceiveItemPrintA4Report from '/imports/vue/ui/report/posInvoiceReceiveItemPrintA4';
import './posInvoiceReceiveItemPrintA4.html';

let index = Template.pos_invoiceReceiveItemPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoiceReceiveItemPrintA4Report),
        component: posInvoiceReceiveItemPrintA4Report
    }).$mount('#posInvoiceReceiveItemPrintA4-report')
});

index.onDestroyed(function () {
    $('.posInvoiceReceiveItemPrintA4-report').remove();
});