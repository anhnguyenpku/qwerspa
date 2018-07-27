import './schPayment.html';
import schPayment from '/imports/vue/ui/schPayment.vue';

let indexTmpl = Template.sch_payment;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schPayment)
    }).$mount('sch_payment');
});

indexTmpl.onDestroyed(function () {
    $('.sch_payment').remove();
});
