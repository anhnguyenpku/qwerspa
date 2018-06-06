import posPurchaseByVendorDetailReport from '/imports/vue/ui/report/posPurchaseByVendorDetail';
import './posPurchaseByVendorDetail.html';

let index = Template.pos_purchaseByVendorDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPurchaseByVendorDetailReport),
        component: posPurchaseByVendorDetailReport
    }).$mount('#posPurchaseByVendorDetail-report')
});

index.onDestroyed(function () {
    $('.posPurchaseByVendorDetail-report').remove();
});