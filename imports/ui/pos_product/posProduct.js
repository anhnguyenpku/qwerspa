import './posProduct.html';
import posProduct from '/imports/vue/ui/posProduct';

let indexTmpl = Template.pos_product;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posProduct)
    }).$mount('pos_product');
});

indexTmpl.onDestroyed(function () {
    $('.pos_product').remove();
});

