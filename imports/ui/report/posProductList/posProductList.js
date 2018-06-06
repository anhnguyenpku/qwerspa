import posProductListReport from '/imports/vue/ui/report/posProductList';
import './posProductList.html';

let index = Template.pos_productListReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posProductListReport),
        component: posProductListReport
    }).$mount('#posProductList-report')
});

index.onDestroyed(function () {
    $('.posProductList-report').remove();
});