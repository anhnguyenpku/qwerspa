import './employee.html';
import '../area/area';

let indexTmpl = Template.wb_employee;
import employee from '/imports/vue/ui/Employee.vue';

indexTmpl.helpers({
    notChoosenArea() {
        return _.isUndefined(Session.get('area'));
    }
});

indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(employee)
    }).$mount('#employee');
});

indexTmpl.onDestroyed(function () {
    $('.employee').empty();
});