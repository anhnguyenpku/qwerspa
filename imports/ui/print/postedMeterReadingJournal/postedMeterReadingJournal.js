import './postedMeterReadingJournal.html';
import PrintPostedMRJ from '/imports/vue/ui/print/PostedMeterReadingJournal.vue'; // print meter reading journal
Template.wb_postedPrintMeterReadingJournal.onRendered(function () {
    new Vue({
        render: h => h(PrintPostedMRJ),
        components: {
            PrintPostedMRJ
        }
    }).$mount('#print-posted-meter-reading-journal');
});

Template.wb_postedPrintMeterReadingJournal.onDestroyed(function () {
    $('.print-posted-meter-reading').remove();
});