import './sch_level.html';
import schLevel from '/imports/vue/ui/schLevel';

let indexTmpl = Template.sch_level;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schLevel)
    }).$mount('sch_level');
});

indexTmpl.onDestroyed(function () {
    $('.sch_level').remove();
});

