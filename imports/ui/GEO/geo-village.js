import './geo-village.html';
import GeoVillage from '/imports/vue/ui/report/GeoVillage.vue'
Template.wb_geoVillage.onRendered(function () {
    new Vue({
        render: h => h(GeoVillage)
    }).$mount('#geo-village');
});

Template.wb_geoVillage.onDestroyed(function () {
    $(".geo-village-report").remove();
});