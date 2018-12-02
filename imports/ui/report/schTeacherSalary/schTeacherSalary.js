import schTeacherSalaryReport from '/imports/vue/ui/report/schTeacherSalary';
import './schTeacherSalary.html';

let index = Template.sch_teacherSalaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schTeacherSalaryReport),
        component: schTeacherSalaryReport
    }).$mount('#schTeacherSalary-report')
});

index.onDestroyed(function () {
    $('.schTeacherSalary-report').remove();
});