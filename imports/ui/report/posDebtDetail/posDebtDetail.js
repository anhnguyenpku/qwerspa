import posDebtDetailReport from '/imports/vue/ui/report/posDebtDetail.vue';
import './posDebtDetail.html';

let index = Template.pos_debtDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posDebtDetailReport),
        component: posDebtDetailReport
    }).$mount('#posDebtDetail-report')
});

index.onDestroyed(function () {
    $('.posDebtDetail-report').remove();
});