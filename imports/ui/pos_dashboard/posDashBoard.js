import './posDashboard.html';
import posDashboard from '/imports/vue/ui/posDashboard';

let indexTmpl = Template.pos_dashBoard;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posDashboard)
    }).$mount('pos_dashBoard');
});

indexTmpl.onDestroyed(function () {
    $('.pos_dashBoard').remove();
});

