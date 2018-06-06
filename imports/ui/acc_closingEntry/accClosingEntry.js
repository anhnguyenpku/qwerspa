import './accClosingEntry.html';
import accClosingEntry from '/imports/vue/ui/accClosingEntry.vue';

let indexTmpl = Template.acc_closingEntry;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(accClosingEntry)
    }).$mount('closing-entry');
});

indexTmpl.onDestroyed(function () {
    $('.closing-entry').remove();
});

