import schBusRegisterActiveReport from '/imports/vue/ui/report/schBusRegisterActive';
import './schBusRegisterActive.html';

let index = Template.sch_busRegisterActiveReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusRegisterActiveReport),
        component: schBusRegisterActiveReport
    }).$mount('#schBusRegisterActive-report')
});

index.onDestroyed(function () {
    $('.schBusRegisterActive-report').remove();
});