import posSaleByCustomerDetailReport from '/imports/vue/ui/report/posSaleByCustomerDetail';
import './posSaleByCustomerDetail.html';

let index = Template.pos_saleByCustomerDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleByCustomerDetailReport),
        component: posSaleByCustomerDetailReport
    }).$mount('#posSaleByCustomerDetail-report')
});

index.onDestroyed(function () {
    $('.posSaleByCustomerDetail-report').remove();
});