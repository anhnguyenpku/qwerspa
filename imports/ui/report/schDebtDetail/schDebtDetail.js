import schDebtDetailReport from '/imports/vue/ui/report/schDebtDetail';
import './schDebtDetail.html';

let index = Template.sch_debtDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schDebtDetailReport),
        component: schDebtDetailReport
    }).$mount('#schDebtDetail-report')
});

index.onDestroyed(function () {
    $('.schDebtDetail-report').remove();
});