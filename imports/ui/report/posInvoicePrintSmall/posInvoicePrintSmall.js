import posInvoicePrintSmallReport from '/imports/vue/ui/report/posInvoicePrintSmall';
import './posInvoicePrintSmall.html';

let index = Template.pos_invoicePrintSmallReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoicePrintSmallReport),
        component: posInvoicePrintSmallReport
    }).$mount('#posInvoicePrintSmall-report')
});

index.onDestroyed(function () {
    $('.posInvoicePrintSmall-report').remove();
});