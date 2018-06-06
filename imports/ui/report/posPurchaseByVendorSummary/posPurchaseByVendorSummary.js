import posPurchaseByVendorSummaryReport from '/imports/vue/ui/report/posPurchaseByVendorSummary';
import './posPurchaseByVendorSummary.html';

let index = Template.pos_purchaseByVendorSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPurchaseByVendorSummaryReport),
        component: posPurchaseByVendorSummaryReport
    }).$mount('#posPurchaseByVendorSummary-report')
});

index.onDestroyed(function () {
    $('.posPurchaseByVendorSummary-report').remove();
});