import './sch_major.html';
import schMajor from '/imports/vue/ui/schMajor';

let indexTmpl = Template.sch_major;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schMajor)
    }).$mount('sch_major');
});

indexTmpl.onDestroyed(function () {
    $('.sch_major').remove();
});

