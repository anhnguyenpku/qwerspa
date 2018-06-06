import posReceivePaymentSummaryReport from '/imports/vue/ui/report/posReceivePaymentSummary.vue';
import './posReceivePaymentSummary.html';

let index = Template.pos_receivePaymentSummaryReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posReceivePaymentSummaryReport),
        component: posReceivePaymentSummaryReport
    }).$mount('#posReceivePaymentSummary-report')
});

index.onDestroyed(function () {
    $('.posReceivePaymentSummary-report').remove();
});