import daikaomReport from '/imports/vue/ui/report/daikaom.vue';
import './daikaom.html';
let index = Template.wb_daikaomReport;
index.onRendered(function () {
    new Vue({
        render: h => h(daikaomReport),
        component: daikaomReport
    }).$mount('#daikaom-report')
});

index.onDestroyed(function () {
    $('.daikaom-report').remove();
});