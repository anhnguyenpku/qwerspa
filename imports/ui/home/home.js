import './home.html';
import '../area/area';

let indexTmpl = Template.wb_home;

indexTmpl.helpers({
    notChoosenArea() {
        return _.isUndefined(Session.get('area'));
    },
    isWB() {
        return Session.get("module") == "Water Billing";
    }


});

indexTmpl.onRendered(function () {
    let querySelector = $('#dashboard');
    if (querySelector.length) {
        new Vue({
            render: h => h()
        }).$mount('#dashboard');
    }
});

indexTmpl.onDestroyed(function () {
    $('.dashboard').empty();
});