import './posTransferInventory.html';
import posTransferInventory from '/imports/vue/ui/posTransferInventory.vue';

let indexTmpl = Template.pos_transferInventory;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posTransferInventory)
    }).$mount('pos_transferInventory');
});

indexTmpl.onDestroyed(function () {
    $('.pos_transferInventory').remove();
});
