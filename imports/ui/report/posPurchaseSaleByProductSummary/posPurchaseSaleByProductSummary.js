import posPurchaseSaleByProductSummaryReport from '/imports/vue/ui/report/posPurchaseSaleByProductSummary';
import './posPurchaseSaleByProductSummary.html';

let index = Template.pos_purchaseSaleByProductSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPurchaseSaleByProductSummaryReport),
        component: posPurchaseSaleByProductSummaryReport
    }).$mount('#posPurchaseSaleByProductSummary-report')
});

index.onDestroyed(function () {
    $('.posPurchaseSaleByProductSummary-report').remove();
});