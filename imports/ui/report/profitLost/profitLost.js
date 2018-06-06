import profitLostReport from '/imports/vue/ui/report/profitLost.vue';
import './profitLost.html';

let index = Template.acc_profitLostReport;
index.onRendered(function () {
    new Vue({
        render: h => h(profitLostReport),
        component: profitLostReport
    }).$mount('#profitLost-report')
});

index.onDestroyed(function () {
    $('.profitLost-report').remove();
});