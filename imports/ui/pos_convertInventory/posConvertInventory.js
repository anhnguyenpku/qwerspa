import './posConvertInventory.html';
import posConvertInventory from '/imports/vue/ui/posConvertInventory';

let indexTmpl = Template.pos_convertInventory;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posConvertInventory)
    }).$mount('pos_convertInventory');
});

indexTmpl.onDestroyed(function () {
    $('.pos_convertInventory').remove();
});

