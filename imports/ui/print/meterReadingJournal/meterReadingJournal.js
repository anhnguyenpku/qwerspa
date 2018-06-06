import './meterReadingJournal.html';
import PrintMRJ from '/imports/vue/ui/print/MeterReadingJournal.vue'; // print meter reading journal
Template.wb_printMeterReadingJournal.onRendered(function () {
    new Vue({
        render: h => h(PrintMRJ),
        components: {
            PrintMRJ
        }
    }).$mount('#print-meter-reading-journal');
});

Template.wb_printMeterReadingJournal.onDestroyed(function () {
    $('.print-meter-reading').remove();
});