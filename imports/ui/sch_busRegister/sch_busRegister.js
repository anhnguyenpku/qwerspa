import './sch_busRegister.html';
import schBusRegister from '/imports/vue/ui/schBusRegister';

let indexTmpl = Template.sch_busRegister;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schBusRegister)
    }).$mount('sch_busRegister');
});

indexTmpl.onDestroyed(function () {
    $('.sch_busRegister').remove();
});

