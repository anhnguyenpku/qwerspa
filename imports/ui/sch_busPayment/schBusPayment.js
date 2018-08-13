import './schBusPayment.html';
import schBusPayment from '/imports/vue/ui/schBusPayment.vue';

let indexTmpl = Template.sch_busPayment;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schBusPayment)
    }).$mount('sch_busPayment');
});

indexTmpl.onDestroyed(function () {
    $('.sch_busPayment').remove();
});
