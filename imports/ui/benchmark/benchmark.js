import './benchmark.html';
import '../area/area';

let indexTmpl = Template.wb_benchmark;
import benchmark from '/imports/vue/ui/Benchmark.vue';

indexTmpl.helpers({
    notChoosenArea() {
        return _.isUndefined(Session.get('area'));
    }
});

indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(benchmark)
    }).$mount('#benchmark');
});

indexTmpl.onDestroyed(function () {
    $('.benchmark').empty();
});