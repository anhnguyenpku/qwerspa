import posPayBillSummaryReport from '/imports/vue/ui/report/posPayBillSummary.vue';
import './posPayBillSummary.html';

let index = Template.pos_payBillSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPayBillSummaryReport),
        component: posPayBillSummaryReport
    }).$mount('#posPayBillSummary-report')
});

index.onDestroyed(function () {
    $('.posPayBillSummary-report').remove();
});