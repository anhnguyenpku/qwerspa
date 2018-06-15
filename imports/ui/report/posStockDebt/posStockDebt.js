import posStockDebtReport from '/imports/vue/ui/report/posStockDebt';
import './posStockDebt.html';

let index = Template.pos_stockDebtReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posStockDebtReport),
        component: posStockDebtReport
    }).$mount('#posStockDebt-report')
});

index.onDestroyed(function () {
    $('.posStockDebt-report').remove();
});