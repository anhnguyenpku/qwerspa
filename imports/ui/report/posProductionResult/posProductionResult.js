import posProductionResultReport from '/imports/vue/ui/report/posProductionResult';
import './posProductionResult.html';

let index = Template.pos_productionResultReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posProductionResultReport),
        component: posProductionResultReport
    }).$mount('#posProductionResult-report')
});

index.onDestroyed(function () {
    $('.posProductionResult-report').remove();
});