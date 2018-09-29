import './posSaleCoffee.html';
import posSaleCoffee from '/imports/vue/ui/posSaleCoffee.vue';

let indexTmpl = Template.pos_SaleCoffee;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posSaleCoffee)
    }).$mount('pos_SaleCoffee');
});

indexTmpl.onDestroyed(function () {
    $('.pos_SaleCoffee').remove();
});
