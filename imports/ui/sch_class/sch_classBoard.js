import './sch_classBoard.html';
import schClassBoard from '/imports/vue/ui/schClassBoard';

let indexTmpl = Template.sch_classBoard;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schClassBoard)
    }).$mount('sch_classBoard');
});

indexTmpl.onDestroyed(function () {
    $('.sch_classBoard').remove();
});

