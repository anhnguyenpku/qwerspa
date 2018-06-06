import './posUnit.html';
import posUnit from '/imports/vue/ui/posUnit';

let indexTmpl = Template.pos_unit;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posUnit)
    }).$mount('pos_unit');
});

indexTmpl.onDestroyed(function () {
    $('.pos_unit').remove();
});

