import posPurchaseByProductDetailReport from '/imports/vue/ui/report/posPurchaseByProductDetail';
import './posPurchaseByProductDetail.html';

let index = Template.pos_purchaseByProductDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPurchaseByProductDetailReport),
        component: posPurchaseByProductDetailReport
    }).$mount('#posPurchaseByProductDetail-report')
});

index.onDestroyed(function () {
    $('.posPurchaseByProductDetail-report').remove();
});