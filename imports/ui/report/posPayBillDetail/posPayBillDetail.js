import posPayBillDetailReport from '/imports/vue/ui/report/posPayBillDetail.vue';
import './posPayBillDetail.html';

let index = Template.pos_payBillDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posPayBillDetailReport),
        component: posPayBillDetailReport
    }).$mount('#posPayBillDetail-report')
});

index.onDestroyed(function () {
    $('.posPayBillDetail-report').remove();
});