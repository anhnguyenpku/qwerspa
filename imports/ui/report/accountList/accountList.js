import accountListReport from '/imports/vue/ui/report/accountList.vue';
import './accountList.html';

let index = Template.acc_accountListReport;
index.onRendered(function () {
    new Vue({
        render: h => h(accountListReport),
        component: accountListReport
    }).$mount('#accountList-report')
});

index.onDestroyed(function () {
    $('.accountList-report').remove();
});