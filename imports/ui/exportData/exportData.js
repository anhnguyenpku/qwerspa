import './exportData.html';
import ExportData from '/imports/vue/ui/ExportData.vue';
Template.wb_exportData.onRendered(function () {
    new Vue({
        render: h => h(ExportData)
    }).$mount('#exportData')

});

Template.wb_exportData.onDestroyed(function () {
    $('.exportData').empty();
});