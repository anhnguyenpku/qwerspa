import './pos_payBill.html';
import posPayBill from '/imports/vue/ui/posPayBill.vue';

let indexTmpl = Template.pos_payBill;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posPayBill)
    }).$mount('pos_payBill');
});

indexTmpl.onDestroyed(function () {
    $('.pos_payBill').remove();
});
