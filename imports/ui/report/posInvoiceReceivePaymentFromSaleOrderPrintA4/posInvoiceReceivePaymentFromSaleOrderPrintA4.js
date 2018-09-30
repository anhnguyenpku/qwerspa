import posInvoiceReceivePaymentFromSaleOrderPrintA4Report
    from '/imports/vue/ui/report/posInvoiceReceivePaymentFromSaleOrderPrintA4';
import './posInvoiceReceivePaymentFromSaleOrderPrintA4.html';

let index = Template.pos_invoiceReceivePaymentFromSaleOrderPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoiceReceivePaymentFromSaleOrderPrintA4Report),
        component: posInvoiceReceivePaymentFromSaleOrderPrintA4Report
    }).$mount('#posInvoiceReceivePaymentFromSaleOrderPrintA4-report')
});

index.onDestroyed(function () {
    $('.posInvoiceReceivePaymentFromSaleOrderPrintA4-report').remove();
});