import './posSaleOrder.html';
import posSaleOrder from '/imports/vue/ui/posSaleOrder.vue';

let indexTmpl = Template.pos_SaleOrder;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posSaleOrder)
    }).$mount('pos_SaleOrder');
});

indexTmpl.onDestroyed(function () {
    $('.pos_SaleOrder').remove();
});
