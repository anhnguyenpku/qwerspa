import schRegisterReport from '/imports/vue/ui/report/schRegister';
import './schRegister.html';

let index = Template.sch_registerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schRegisterReport),
        component: schRegisterReport
    }).$mount('#schRegister-report')
});

index.onDestroyed(function () {
    $('.schRegister-report').remove();
});