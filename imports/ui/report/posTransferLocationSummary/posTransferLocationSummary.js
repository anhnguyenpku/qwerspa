import posTransferLocationSummaryReport from '/imports/vue/ui/report/posTransferLocationSummary.vue';
import './posTransferLocationSummary.html';

let index = Template.pos_transferLocationSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posTransferLocationSummaryReport),
        component: posTransferLocationSummaryReport
    }).$mount('#posTransferLocationSummary-report')
});

index.onDestroyed(function () {
    $('.posTransferLocationSummary-report').remove();
});