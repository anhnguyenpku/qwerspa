import posSaleByProductSummaryReport from '/imports/vue/ui/report/posSaleByProductSummary';
import './posSaleByProductSummary.html';

let index = Template.pos_saleByProductSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleByProductSummaryReport),
        component: posSaleByProductSummaryReport
    }).$mount('#posSaleByProductSummary-report')
});

index.onDestroyed(function () {
    $('.posSaleByProductSummary-report').remove();
});