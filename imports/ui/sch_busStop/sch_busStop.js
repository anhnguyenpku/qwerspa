import './sch_busStop.html';
import schBusStop from '/imports/vue/ui/schBusStop';

let indexTmpl = Template.sch_busStop;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schBusStop)
    }).$mount('sch_busStop');
});

indexTmpl.onDestroyed(function () {
    $('.sch_busStop').remove();
});

