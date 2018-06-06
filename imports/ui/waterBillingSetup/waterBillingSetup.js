import './waterBillingSetup.html';

import WaterBillingSetup from '/imports/vue/ui/WaterBillingSetup.vue'

Template.wb_waterBillingSetup.onRendered(function () {
    new Vue({
        render: h => h(WaterBillingSetup)
    }).$mount('wb-waterBillingSetup');
});

Template.wb_waterBillingSetup.onDestroyed(function () {
    $('.wb-waterBillingSetup').remove();
});