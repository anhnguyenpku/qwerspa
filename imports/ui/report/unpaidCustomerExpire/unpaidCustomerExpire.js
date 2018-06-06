import UnpaidCustomerExpireReport from '/imports/vue/ui/report/UnpaidCustomerExpire.vue';
import './unpaidCustomerExpire.html';

let index = Template.wb_unpaidCustomerExpireReport;
index.onRendered(function () {
    new Vue({
        render: h => h(UnpaidCustomerExpireReport),
        component: UnpaidCustomerExpireReport
    }).$mount('#unpaid-customer-expire-report')
});

index.onDestroyed(function () {
    $('.unpaid-customer-expire-report').remove();
});