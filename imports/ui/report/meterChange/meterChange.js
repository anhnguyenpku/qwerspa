import MeterChangeReport from '/imports/vue/ui/report/MeterChange.vue';
import './meterChange.html';
let index = Template.wb_meterChangeReport;
index.onRendered(function () {
    new Vue({
        render: h => h(MeterChangeReport),
        component: MeterChangeReport
    }).$mount('#meter-change-report')
});

index.onDestroyed(function () {
    $('.meter-change-report').remove();
});