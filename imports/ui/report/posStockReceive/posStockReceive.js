import posStockReceiveReport from '/imports/vue/ui/report/posStockReceive';
import './posStockReceive.html';

let index = Template.pos_stockReceiveReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posStockReceiveReport),
        component: posStockReceiveReport
    }).$mount('#posStockReceive-report')
});

index.onDestroyed(function () {
    $('.posStockReceive-report').remove();
});