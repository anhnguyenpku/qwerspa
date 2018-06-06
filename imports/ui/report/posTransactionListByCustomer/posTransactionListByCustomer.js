import posTransactionListByCustomerReport from '/imports/vue/ui/report/posTransactionListByCustomer.vue';
import './posTransactionListByCustomer.html';

let index = Template.pos_transactionListByCustomerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posTransactionListByCustomerReport),
        component: posTransactionListByCustomerReport
    }).$mount('#posTransactionListByCustomer-report')
});

index.onDestroyed(function () {
    $('.posTransactionListByCustomer-report').remove();
});