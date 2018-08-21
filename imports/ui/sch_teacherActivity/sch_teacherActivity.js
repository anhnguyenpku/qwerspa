import './sch_teacherActivity.html';
import schTeacherActivity from '/imports/vue/ui/schTeacherActivity';

let indexTmpl = Template.sch_teacherActivity;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schTeacherActivity)
    }).$mount('sch_teacherActivity');
});

indexTmpl.onDestroyed(function () {
    $('.sch_teacherActivity').remove();
});

