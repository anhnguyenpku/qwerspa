import posReceivePaymentDetailReport from '/imports/vue/ui/report/posReceivePaymentDetail.vue';
import './posReceivePaymentDetail.html';

let index = Template.pos_receivePaymentDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posReceivePaymentDetailReport),
        component: posReceivePaymentDetailReport
    }).$mount('#posReceivePaymentDetail-report')
});

index.onDestroyed(function () {
    $('.posReceivePaymentDetail-report').remove();
});