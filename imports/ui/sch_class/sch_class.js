import './sch_class.html';
import schClass from '/imports/vue/ui/schClass';

let indexTmpl = Template.sch_class;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schClass)
    }).$mount('sch_class');
});

indexTmpl.onDestroyed(function () {
    $('.sch_class').remove();
});

