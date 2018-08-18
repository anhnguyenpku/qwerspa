import schBusRegisterReport from '/imports/vue/ui/report/schBusRegister';
import './schBusRegister.html';

let index = Template.sch_busRegisterReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schBusRegisterReport),
        component: schBusRegisterReport
    }).$mount('#schBusRegister-report')
});

index.onDestroyed(function () {
    $('.schBusRegister-report').remove();
});