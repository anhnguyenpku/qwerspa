import blockSummaryUnpaidExpireReport from '/imports/vue/ui/report/blockSummaryUnpaidExpire.vue';
import './blockSummaryUnpaidExpire.html';

let index = Template.wb_blockSummaryUnpaidExpireReport;
index.onRendered(function () {
    new Vue({
        render: h => h(blockSummaryUnpaidExpireReport),
        component: blockSummaryUnpaidExpireReport
    }).$mount('#blockSummaryUnpaidExpire-report')
});

index.onDestroyed(function () {
    $('.blockSummaryUnpaidExpire-report').remove();
});