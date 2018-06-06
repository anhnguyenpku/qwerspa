import posCollectionSheetSummaryReport from '/imports/vue/ui/report/posCollectionSheetSummary.vue';
import './posCollectionSheetSummary.html';

let index = Template.pos_collectionSheetSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posCollectionSheetSummaryReport),
        component: posCollectionSheetSummaryReport
    }).$mount('#posCollectionSheetSummary-report')
});

index.onDestroyed(function () {
    $('.posCollectionSheetSummary-report').remove();
});