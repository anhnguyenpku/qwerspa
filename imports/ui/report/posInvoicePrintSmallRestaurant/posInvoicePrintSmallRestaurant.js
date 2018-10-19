import posInvoicePrintSmallRestaurantReport from '/imports/vue/ui/report/posInvoicePrintSmallRestaurant';
import './posInvoicePrintSmallRestaurant.html';

let index = Template.pos_invoicePrintSmallRestaurantReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posInvoicePrintSmallRestaurantReport),
        component: posInvoicePrintSmallRestaurantReport
    }).$mount('#posInvoicePrintSmallRestaurant-report')
});

index.onDestroyed(function () {
    $('.posInvoicePrintSmallRestaurant-report').remove();
});