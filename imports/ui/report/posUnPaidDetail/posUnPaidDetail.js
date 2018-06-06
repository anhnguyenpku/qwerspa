import posUnPaidDetailReport from '/imports/vue/ui/report/posUnPaidDetail.vue';
import './posUnPaidDetail.html';

let index = Template.pos_unPaidDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posUnPaidDetailReport),
        component: posUnPaidDetailReport
    }).$mount('#posUnPaidDetail-report')
});

index.onDestroyed(function () {
    $('.posUnPaidDetail-report').remove();
});