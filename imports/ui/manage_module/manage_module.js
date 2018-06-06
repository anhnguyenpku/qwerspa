import './manage_module.html';
import manageModule from '/imports/vue/ui/manageModule.vue';

let indexTmpl = Template.manage_module;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(manageModule)
    }).$mount('manage_module');
});

indexTmpl.onDestroyed(function () {
    $('.manage_module').remove();
});

