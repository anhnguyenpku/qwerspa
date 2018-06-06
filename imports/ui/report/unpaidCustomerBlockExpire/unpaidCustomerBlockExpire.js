import UnpaidCustomerBlockExpireReport from '/imports/vue/ui/report/UnpaidCustomerBlockExpire.vue';
import './unpaidCustomerBlockExpire.html';

let index = Template.wb_unpaidCustomerBlockExpireReport;
index.onRendered(function () {
    new Vue({
        render: h => h(UnpaidCustomerBlockExpireReport),
        component: UnpaidCustomerBlockExpireReport
    }).$mount('#unpaid-customer-block-expire-report')
});

index.onDestroyed(function () {
    $('.unpaid-customer-block-expire-report').remove();
});