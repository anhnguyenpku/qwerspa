import './sch_position.html';
import schPosition from '/imports/vue/ui/schPosition';

let indexTmpl = Template.sch_position;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schPosition)
    }).$mount('sch_position');
});

indexTmpl.onDestroyed(function () {
    $('.sch_position').remove();
});

