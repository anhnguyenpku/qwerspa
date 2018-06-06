import posUnPaidSummaryReport from '/imports/vue/ui/report/posUnPaidSummary.vue';
import './posUnPaidSummary.html';

let index = Template.pos_unPaidSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posUnPaidSummaryReport),
        component: posUnPaidSummaryReport
    }).$mount('#posUnPaidSummary-report')
});

index.onDestroyed(function () {
    $('.posUnPaidSummary-report').remove();
});