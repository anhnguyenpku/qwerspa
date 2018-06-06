import posPurchaseByProductSummaryReport from '/imports/vue/ui/report/posPurchaseByProductSummary';
import './posPurchaseByProductSummary.html';

let index = Template.pos_purchaseByProductSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPurchaseByProductSummaryReport),
        component: posPurchaseByProductSummaryReport
    }).$mount('#posPurchaseByProductSummary-report')
});

index.onDestroyed(function () {
    $('.posPurchaseByProductSummary-report').remove();
});