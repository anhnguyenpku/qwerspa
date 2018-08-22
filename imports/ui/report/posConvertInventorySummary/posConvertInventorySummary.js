import posConvertInventorySummaryReport from '/imports/vue/ui/report/posConvertInventorySummary';
import './posConvertInventorySummary.html';

let index = Template.pos_convertInventorySummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posConvertInventorySummaryReport),
        component: posConvertInventorySummaryReport
    }).$mount('#posConvertInventorySummary-report')
});

index.onDestroyed(function () {
    $('.posConvertInventorySummary-report').remove();
});