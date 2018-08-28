import posInvoiceReceivePaymentPrintA4Report from '/imports/vue/ui/report/posInvoiceReceivePaymentPrintA4';
import './posInvoiceReceivePaymentPrintA4.html';

let index = Template.pos_invoiceReceivePaymentPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoiceReceivePaymentPrintA4Report),
        component: posInvoiceReceivePaymentPrintA4Report
    }).$mount('#posInvoiceReceivePaymentPrintA4-report')
});

index.onDestroyed(function () {
    $('.posInvoiceReceivePaymentPrintA4-report').remove();
});