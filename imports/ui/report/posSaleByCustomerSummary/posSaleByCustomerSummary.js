import posSaleByCustomerSummaryReport from '/imports/vue/ui/report/posSaleByCustomerSummary';
import './posSaleByCustomerSummary.html';

let index = Template.pos_saleByCustomerSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleByCustomerSummaryReport),
        component: posSaleByCustomerSummaryReport
    }).$mount('#posSaleByCustomerSummary-report')
});

index.onDestroyed(function () {
    $('.posSaleByCustomerSummary-report').remove();
});