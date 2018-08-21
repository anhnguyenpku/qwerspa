import './sch_activity.html';
import schActivity from '/imports/vue/ui/schActivity';

let indexTmpl = Template.sch_activity;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schActivity)
    }).$mount('sch_activity');
});

indexTmpl.onDestroyed(function () {
    $('.sch_activity').remove();
});

