import './posCustomer.html';
import posCustomer from '/imports/vue/ui/posCustomer';

let indexTmpl = Template.pos_customer;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posCustomer)
    }).$mount('pos_customer');
});

indexTmpl.onDestroyed(function () {
    $('.pos_customer').remove();
});

