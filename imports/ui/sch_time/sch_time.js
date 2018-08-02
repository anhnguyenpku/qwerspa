import './sch_time.html';
import schTime from '/imports/vue/ui/schTime';

let indexTmpl = Template.sch_time;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schTime)
    }).$mount('sch_time');
});

indexTmpl.onDestroyed(function () {
    $('.sch_time').remove();
});

