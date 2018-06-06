import './meterChange.html';
import MeterChange from '/imports/vue/ui/MeterChange.vue';
import MeterChangeComponent from '/imports/vue/components/meterChange/meterChange.vue';
let indexTmpl = Template.wb_meterChange;
let meterChangeComponent = Template.wb_meterChangeComponent;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(MeterChange)
    }).$mount('meter-change');
});

indexTmpl.onDestroyed(function () {
    $('.meter-change').remove();
});


meterChangeComponent.onRendered(function(){
    new Vue({
        render: h => h(MeterChangeComponent)
    }).$mount('meter-change-component');
});