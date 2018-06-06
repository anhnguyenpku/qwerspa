import './posInvoice.html';
import posInvoice from '/imports/vue/ui/posInvoice.vue';

let indexTmpl = Template.pos_Invoice;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posInvoice)
    }).$mount('pos_Invoice');
});

indexTmpl.onDestroyed(function () {
    $('.pos_Invoice').remove();
});
