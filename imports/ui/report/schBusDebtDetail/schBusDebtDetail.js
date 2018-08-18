import schBusDebtDetailReport from '/imports/vue/ui/report/schBusDebtDetail';
import './schBusDebtDetail.html';

let index = Template.sch_busDebtDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusDebtDetailReport),
        component: schBusDebtDetailReport
    }).$mount('#schBusDebtDetail-report')
});

index.onDestroyed(function () {
    $('.schBusDebtDetail-report').remove();
});