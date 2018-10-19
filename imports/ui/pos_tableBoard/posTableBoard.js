import './posTableBoard.html';
import posTableBoard from '/imports/vue/ui/posTableBoard';

let indexTmpl = Template.pos_tableBoard;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posTableBoard)
    }).$mount('pos_tableBoard');
});

indexTmpl.onDestroyed(function () {
    $('.pos_tableBoard').remove();
});

