import ledgerReport from '/imports/vue/ui/report/ledger.vue';
import './ledger.html';

let index = Template.acc_ledgerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(ledgerReport),
        component: ledgerReport
    }).$mount('#ledger-report')
});

index.onDestroyed(function () {
    $('.ledger-report').remove();
});