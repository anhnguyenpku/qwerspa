import './sch_register.html';
import schRegister from '/imports/vue/ui/schRegister';

let indexTmpl = Template.sch_register;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schRegister)
    }).$mount('sch_register');
});

indexTmpl.onDestroyed(function () {
    $('.sch_register').remove();
});

