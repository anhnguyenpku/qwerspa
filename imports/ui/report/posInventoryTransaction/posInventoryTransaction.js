import posInventoryTransactionReport from '/imports/vue/ui/report/posInventoryTransaction.vue';
import './posInventoryTransaction.html';

let index = Template.pos_inventoryTransactionReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posInventoryTransactionReport),
        component: posInventoryTransactionReport
    }).$mount('#posInventoryTransaction-report')
});

index.onDestroyed(function () {
    $('.posInventoryTransaction-report').remove();
});