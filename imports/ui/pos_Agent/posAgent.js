import './posAgent.html';
import posAgent from '/imports/vue/ui/posAgent';

let indexTmpl = Template.pos_agent;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posAgent)
    }).$mount('pos_agent');
});

indexTmpl.onDestroyed(function () {
    $('.pos_agent').remove();
});

