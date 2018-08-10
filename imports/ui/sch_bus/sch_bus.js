import './sch_bus.html';
import schBus from '/imports/vue/ui/schBus';

let indexTmpl = Template.sch_bus;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schBus)
    }).$mount('sch_bus');
});

indexTmpl.onDestroyed(function () {
    $('.sch_bus').remove();
});

