import posConvertInventoryReport from '/imports/vue/ui/report/posConvertInventory';
import './posConvertInventory.html';

let index = Template.pos_convertInventoryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posConvertInventoryReport),
        component: posConvertInventoryReport
    }).$mount('#posConvertInventory-report')
});

index.onDestroyed(function () {
    $('.posConvertInventory-report').remove();
});