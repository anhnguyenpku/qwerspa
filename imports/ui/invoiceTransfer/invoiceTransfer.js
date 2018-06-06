import './invoiceTransfer.html';
import InvoiceTransfer from '/imports/vue/ui/InvoiceTransfer.vue';

Template.wb_invoiceTransfer.onRendered(function () {
    new Vue({
        render: h => h(InvoiceTransfer)
    }).$mount('#invoice-transfer');
});

Template.wb_invoiceTransfer.onDestroyed(function () {
    $('.invoice-transfer').empty();
});