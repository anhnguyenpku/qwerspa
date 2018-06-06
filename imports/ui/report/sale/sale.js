import SaleReport from '/imports/vue/ui/report/Sale.vue';
import './sale.html';
let index = Template.wb_saleReport;
index.onRendered(function () {
    new Vue({
        render: h => h(SaleReport),
        component: SaleReport
    }).$mount('#sale-report')
});

index.onDestroyed(function () {
    $('.sale-report').remove();
});