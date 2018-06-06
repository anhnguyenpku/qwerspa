import './accExchange.html';
import accExchange from '/imports/vue/ui/accExchange.vue';

let indexTmpl = Template.acc_exchange;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(accExchange)
    }).$mount('exchange');
});

indexTmpl.onDestroyed(function () {
    $('.exchange').remove();
});
