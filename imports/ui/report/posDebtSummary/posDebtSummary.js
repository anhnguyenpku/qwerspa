import posDebtSummaryReport from '/imports/vue/ui/report/posDebtSummary.vue';
import './posDebtSummary.html';

let index = Template.pos_debtSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posDebtSummaryReport),
        component: posDebtSummaryReport
    }).$mount('#posDebtSummary-report')
});

index.onDestroyed(function () {
    $('.posDebtSummary-report').remove();
});