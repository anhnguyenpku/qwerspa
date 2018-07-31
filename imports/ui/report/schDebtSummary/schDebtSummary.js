import schDebtSummaryReport from '/imports/vue/ui/report/schDebtSummary';
import './schDebtSummary.html';

let index = Template.sch_debtSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schDebtSummaryReport),
        component: schDebtSummaryReport
    }).$mount('#schDebtSummary-report')
});

index.onDestroyed(function () {
    $('.schDebtSummary-report').remove();
});