import './sch_student.html';
import shcStudent from '/imports/vue/ui/sch_student.vue';

let indexTmpl = Template.sch_student;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(shcStudent)
    }).$mount('sch_student');
});

indexTmpl.onDestroyed(function () {
    $('.sch_student').remove();
});

