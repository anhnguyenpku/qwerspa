import schStudentListReport from '/imports/vue/ui/report/schStudentList';
import './schStudentList.html';

let index = Template.sch_studentListReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schStudentListReport),
        component: schStudentListReport
    }).$mount('#schStudentList-report')
});

index.onDestroyed(function () {
    $('.schStudentList-report').remove();
});