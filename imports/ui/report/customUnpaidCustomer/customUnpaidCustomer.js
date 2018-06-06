import CustomUnpaidCustomerReport from '/imports/vue/ui/report/CustomUnpaidCustomer.vue';
import './customUnpaidCustomer.html';
let index = Template.wb_customUnpaidCustomerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(CustomUnpaidCustomerReport),
        component: CustomUnpaidCustomerReport
    }).$mount('#custom-unpaid-customer-report')
});

index.onDestroyed(function () {
    $('.custom-unpaid-customer-report').remove();
});