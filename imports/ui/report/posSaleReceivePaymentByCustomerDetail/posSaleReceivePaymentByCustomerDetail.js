import posSaleReceivePaymentByCustomerDetailReport from '/imports/vue/ui/report/posSaleReceivePaymentByCustomerDetail';
import './posSaleReceivePaymentByCustomerDetail.html';

let index = Template.pos_saleReceivePaymentByCustomerDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleReceivePaymentByCustomerDetailReport),
        component: posSaleReceivePaymentByCustomerDetailReport
    }).$mount('#posSaleReceivePaymentByCustomerDetail-report')
});

index.onDestroyed(function () {
    $('.posSaleReceivePaymentByCustomerDetail-report').remove();
});