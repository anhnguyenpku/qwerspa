import './accJournal.html';
import accJournal from '/imports/vue/ui/accJournal.vue';
let indexTmpl = Template.acc_journal;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(accJournal)
    }).$mount('journal');
});

indexTmpl.onDestroyed(function () {
    $('.journal').remove();
});
