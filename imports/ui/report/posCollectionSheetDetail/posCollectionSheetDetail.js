import posCollectionSheetDetailReport from '/imports/vue/ui/report/posCollectionSheetDetail.vue';
import './posCollectionSheetDetail.html';

let index = Template.pos_collectionSheetDetailReport;
index.onRendered(function () {
    new Vue({
        render: h => h(posCollectionSheetDetailReport),
        component: posCollectionSheetDetailReport
    }).$mount('#posCollectionSheetDetail-report')
});

index.onDestroyed(function () {
    $('.posCollectionSheetDetail-report').remove();
});