import './posSaleRestaurant.html';
import posSaleRestaurant from '/imports/vue/ui/posSaleRestaurant.vue';

let indexTmpl = Template.pos_SaleRestaurant;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posSaleRestaurant)
    }).$mount('pos_SaleRestaurant');
});
indexTmpl.onDestroyed(function () {
    $('.pos_SaleRestaurant').remove();
});
