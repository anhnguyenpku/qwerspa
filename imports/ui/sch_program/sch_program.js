import './sch_program.html';
import schProgram from '/imports/vue/ui/schProgram';

let indexTmpl = Template.sch_program;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schProgram)
    }).$mount('sch_program');
});

indexTmpl.onDestroyed(function () {
    $('.sch_program').remove();
});

