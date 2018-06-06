import posSaleByProductDetailReport from '/imports/vue/ui/report/posSaleByProductDetail';
import './posSaleByProductDetail.html';

let index = Template.pos_saleByProductDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleByProductDetailReport),
        component: posSaleByProductDetailReport
    }).$mount('#posSaleByProductDetail-report')
});

index.onDestroyed(function () {
    $('.posSaleByProductDetail-report').remove();
});