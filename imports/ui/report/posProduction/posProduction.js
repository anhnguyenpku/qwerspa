import posProductionReport from '/imports/vue/ui/report/posProduction';
import './posProduction.html';

let index = Template.pos_productionReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posProductionReport),
        component: posProductionReport
    }).$mount('#posProduction-report')
});

index.onDestroyed(function () {
    $('.posProduction-report').remove();
});