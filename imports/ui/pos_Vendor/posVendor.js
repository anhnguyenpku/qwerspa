import './posVendor.html';
import posVendor from '/imports/vue/ui/posVendor';

let indexTmpl = Template.pos_vendor;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posVendor)
    }).$mount('pos_vendor');
});

indexTmpl.onDestroyed(function () {
    $('.pos_vendor').remove();
});

