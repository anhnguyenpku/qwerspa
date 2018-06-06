import './sch_ciriculumn.html';
import schCiriculumn from '/imports/vue/ui/schCiriculumn';

let indexTmpl = Template.sch_ciriculumn;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schCiriculumn)
    }).$mount('sch_ciriculumn');
});

indexTmpl.onDestroyed(function () {
    $('.sch_ciriculumn').remove();
});

