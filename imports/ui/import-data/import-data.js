import './import-data.html';
import ImportData from '/imports/vue/ui/ImportData.vue';
Template.wb_importData.onRendered(function () {
    new Vue({
        render: h => h(ImportData)
    }).$mount('import-data');
});


Template.wb_importData.onDestroyed(function () {
    $('.wb-import-data').remove();
});