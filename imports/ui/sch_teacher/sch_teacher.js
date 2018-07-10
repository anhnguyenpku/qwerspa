import './sch_teacher.html';
import shcTeacher from '/imports/vue/ui/sch_teacher.vue';

let indexTmpl = Template.sch_teacher;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(shcTeacher)
    }).$mount('sch_teacher');
});

indexTmpl.onDestroyed(function () {
    $('.sch_teacher').remove();
});

