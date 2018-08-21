import schTeacherActivityReport from '/imports/vue/ui/report/schTeacherActivity';
import './schTeacherActivity.html';

let index = Template.sch_teacherActivityReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schTeacherActivityReport),
        component: schTeacherActivityReport
    }).$mount('#schTeacherActivity-report')
});

index.onDestroyed(function () {
    $('.schTeacherActivity-report').remove();
});