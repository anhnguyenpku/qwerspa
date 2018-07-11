import './sch_classTable.html';
import schClassTable from '/imports/vue/ui/schClassTable';

let indexTmpl = Template.sch_classTable;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schClassTable)
    }).$mount('sch_classTable');
});

indexTmpl.onDestroyed(function () {
    $('.sch_classTable').remove();
});

