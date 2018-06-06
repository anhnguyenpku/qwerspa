import journalReport from '/imports/vue/ui/report/journal.vue';
import './journal.html';

let index = Template.acc_journalReport;
index.onRendered(function () {
    new Vue({
        render: h => h(journalReport),
        component: journalReport
    }).$mount('#journal-report')
});

index.onDestroyed(function () {
    $('.journal-report').remove();
});