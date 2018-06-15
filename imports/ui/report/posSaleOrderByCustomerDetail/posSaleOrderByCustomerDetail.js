import posSaleOrderByCustomerDetailReport from '/imports/vue/ui/report/posSaleOrderByCustomerDetail';
import './posSaleOrderByCustomerDetail.html';

let index = Template.pos_saleOrderByCustomerDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleOrderByCustomerDetailReport),
        component: posSaleOrderByCustomerDetailReport
    }).$mount('#posSaleOrderByCustomerDetail-report')
});

index.onDestroyed(function () {
    $('.posSaleOrderByCustomerDetail-report').remove();
});