import './benchmarkSum.html';
import '../area/area';

let indexTmpl = Template.wb_benchmarkSum;
import benchmarkSum from '/imports/vue/ui/BenchmarkSum.vue';

indexTmpl.helpers({
    notChoosenArea() {
        return _.isUndefined(Session.get('area'));
    }
});

indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(benchmarkSum)
    }).$mount('#benchmarkSum');
});

indexTmpl.onDestroyed(function () {
    $('.benchmarkSum').empty();
});