import trialBalanceReport from '/imports/vue/ui/report/trialBalance.vue';
import './trialBalance.html';

let index = Template.acc_trialBalanceReport;
index.onRendered(function () {
    new Vue({
        render: h => h(trialBalanceReport),
        component: trialBalanceReport
    }).$mount('#trialBalance-report')
});

index.onDestroyed(function () {
    $('.trialBalance-report').remove();
});