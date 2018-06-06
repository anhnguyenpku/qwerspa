import posInventoryEndingReport from '/imports/vue/ui/report/posInventoryEnding.vue';
import './posInventoryEnding.html';

let index = Template.pos_inventoryEndingReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posInventoryEndingReport),
        component: posInventoryEndingReport
    }).$mount('#posInventoryEnding-report')
});

index.onDestroyed(function () {
    $('.posInventoryEnding-report').remove();
});