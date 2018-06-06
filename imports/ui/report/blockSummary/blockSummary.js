import blockSummaryReport from '/imports/vue/ui/report/blockSummary.vue';
import './blockSummary.html';
let index = Template.wb_blockSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(blockSummaryReport),
        component: blockSummaryReport
    }).$mount('#blockSummary-report')
});

index.onDestroyed(function () {
    $('.blockSummary-report').remove();
});