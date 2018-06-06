import './posBill.html';
import posBill from '/imports/vue/ui/posBill.vue';

let indexTmpl = Template.pos_Bill;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posBill)
    }).$mount('pos_Bill');
});

indexTmpl.onDestroyed(function () {
    $('.pos_Bill').remove();
});
