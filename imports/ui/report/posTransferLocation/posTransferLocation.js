import posTransferLocationReport from '/imports/vue/ui/report/posTransferLocation.vue';
import './posTransferLocation.html';

let index = Template.pos_transferLocationReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posTransferLocationReport),
        component: posTransferLocationReport
    }).$mount('#posTransferLocation-report')
});

index.onDestroyed(function () {
    $('.posTransferLocation-report').remove();
});