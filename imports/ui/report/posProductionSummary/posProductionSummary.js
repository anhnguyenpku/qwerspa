import posProductionSummaryReport from '/imports/vue/ui/report/posProductionSummary';
import './posProductionSummary.html';

let index = Template.pos_productionSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posProductionSummaryReport),
        component: posProductionSummaryReport
    }).$mount('#posProductionSummary-report')
});

index.onDestroyed(function () {
    $('.posProductionSummary-report').remove();
});