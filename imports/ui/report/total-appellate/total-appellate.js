import TotalAppellateReport from '/imports/vue/ui/report/total-appellate.vue';
import './total-appellate.html';
let index = Template.wb_total_appellateReport;
index.onRendered(function () {
    new Vue({
        render: h => h(TotalAppellateReport),
        component: TotalAppellateReport
    }).$mount('#total-appellate-report')
});

index.onDestroyed(function () {
    $('.total-appellate-report').remove();
});