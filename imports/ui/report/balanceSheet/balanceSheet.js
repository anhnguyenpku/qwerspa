import balanceSheetReport from '/imports/vue/ui/report/balanceSheet.vue';
import './balanceSheet.html';

let index = Template.acc_balanceSheetReport;
index.onRendered(function () {
    new Vue({
        render: h => h(balanceSheetReport),
        component: balanceSheetReport
    }).$mount('#balanceSheet-report')
});

index.onDestroyed(function () {
    $('.balanceSheet-report').remove();
});