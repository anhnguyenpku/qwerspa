import transactionReport from '/imports/vue/ui/report/transactionDetail.vue';
import './transactionDetail.html';

let index = Template.acc_transactionDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(transactionReport),
        component: transactionReport
    }).$mount('#transactionDetail-report')
});

index.onDestroyed(function () {
    $('.transactionDetail-report').remove();
});