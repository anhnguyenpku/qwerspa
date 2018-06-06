import './generalinformation.html';
import '../area/area';

let indexTmpl = Template.wb_generalinformation;
import generalinformation from '/imports/vue/ui/Generalinformation.vue';

indexTmpl.helpers({
    notChoosenArea() {
        return _.isUndefined(Session.get('area'));
    }
});

indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(generalinformation)
    }).$mount('#generalinformation');
});

indexTmpl.onDestroyed(function () {
    $('.generalinformation').empty();
});