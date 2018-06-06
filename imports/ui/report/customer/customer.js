import CustomerReport from '/imports/vue/ui/report/Customer.vue';
import './customer.html';
let index = Template.wb_customerReport;
index.onRendered(function () {
    new Vue({
        render: h => h(CustomerReport),
        component: CustomerReport
    }).$mount('#customer-report')
});

index.onDestroyed(function () {
    $('.customer-report').remove();
});