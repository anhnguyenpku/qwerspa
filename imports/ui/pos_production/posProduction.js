import './posProduction.html';
import posProduction from '/imports/vue/ui/posProduction';

let indexTmpl = Template.pos_production;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posProduction)
    }).$mount('pos_production');
});

indexTmpl.onDestroyed(function () {
    $('.pos_production').remove();
});

