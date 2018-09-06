import fixedAssetReport from '/imports/vue/ui/report/accFixedAsset';
import './accFuxedAsset.html';

let index = Template.acc_fixedAssetReport;
index.onRendered(function () {
    new Vue({
        render: h => h(fixedAssetReport),
        component: fixedAssetReport
    }).$mount('#fixedAsset-report')
});

index.onDestroyed(function () {
    $('.fixedAsset-report').remove();
});