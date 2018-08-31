import './posProductionBoard.html';
import posProductionBoard from '/imports/vue/ui/posProductionBoard';

let indexTmpl = Template.pos_productionBoard;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posProductionBoard)
    }).$mount('pos_productionBoard');
});

indexTmpl.onDestroyed(function () {
    $('.pos_productionBoard').remove();
});

