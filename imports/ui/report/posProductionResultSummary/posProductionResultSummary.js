import posProductionResultSummaryReport from '/imports/vue/ui/report/posProductionResultSummary';
import './posProductionResultSummary.html';

let index = Template.pos_productionResultSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posProductionResultSummaryReport),
        component: posProductionResultSummaryReport
    }).$mount('#posProductionResultSummary-report')
});

index.onDestroyed(function () {
    $('.posProductionResultSummary-report').remove();
});