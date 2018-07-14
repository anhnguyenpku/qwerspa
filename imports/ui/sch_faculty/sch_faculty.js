import './sch_faculty.html';
import schFaculty from '/imports/vue/ui/schFaculty';

let indexTmpl = Template.sch_faculty;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schFaculty)
    }).$mount('sch_faculty');
});

indexTmpl.onDestroyed(function () {
    $('.sch_faculty').remove();
});

