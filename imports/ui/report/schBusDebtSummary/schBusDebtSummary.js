import schBusDebtSummaryReport from '/imports/vue/ui/report/schBusDebtSummary';
import './schBusDebtSummary.html';

let index = Template.sch_busDebtSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusDebtSummaryReport),
        component: schBusDebtSummaryReport
    }).$mount('#schBusDebtSummary-report')
});

index.onDestroyed(function () {
    $('.schBusDebtSummary-report').remove();
});