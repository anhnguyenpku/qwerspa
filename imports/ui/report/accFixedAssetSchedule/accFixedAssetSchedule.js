import accFixedAssetSchedule4Report from '/imports/vue/ui/report/accFixedAssetSchedule';
import './accFixedAssetSchedule.html';

let index = Template.acc_fixedAssetScheduleReport;
index.onRendered(function () {
    new Vue({
        render: h => h(accFixedAssetSchedule4Report),
        component: accFixedAssetSchedule4Report
    }).$mount('#accFixedAssetSchedule-report')
});

index.onDestroyed(function () {
    $('.accFixedAssetSchedule-report').remove();
});