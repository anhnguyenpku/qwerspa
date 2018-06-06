import './accChartAccount.html';
import accChartAccount from '/imports/vue/ui/accChartAccount.vue';
import accChartAccountComponent from '/imports/vue/components/accounting/accChartAccount.vue';

let indexTmpl = Template.acc_chartAccount;
// let chartAccountComponent = Template.acc_chartAccountComponent;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(accChartAccount)
    }).$mount('chart-account');
});

indexTmpl.onDestroyed(function () {
    $('.chart-account').remove();
});


/*
chartAccountComponent.onRendered(function(){
    new Vue({
        render: h => h(accChartAccountComponent)
    }).$mount('chart-account-component');
});*/
