import UnpaidCustomerReport from '/imports/vue/ui/report/UnpaidCustomer.vue';
import './unpaidCustomer.html';
let index = Template.wb_unpaidCustomerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(UnpaidCustomerReport),
        component: UnpaidCustomerReport
    }).$mount('#unpaid-customer-report')
});

index.onDestroyed(function () {
    $('.unpaid-customer-report').remove();
});