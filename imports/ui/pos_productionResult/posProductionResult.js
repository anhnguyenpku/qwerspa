import './posProductionResult.html';
import posProductionResult from '/imports/vue/ui/posProductionResult';

let indexTmpl = Template.pos_productionResult;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posProductionResult)
    }).$mount('pos_productionResult');
});

indexTmpl.onDestroyed(function () {
    $('.pos_productionResult').remove();
});

