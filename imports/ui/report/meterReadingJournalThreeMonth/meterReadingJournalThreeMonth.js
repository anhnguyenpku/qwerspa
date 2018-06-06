import meterReadingJournalThreeMonthReport from '/imports/vue/ui/report/meterReadingJournalThreeMonth';
import './meterReadingJournalThreeMonth.html';
let index = Template.wb_meterReadingJournalThreeMonthReport;
index.onRendered(function () {
    new Vue({
        render: h => h(meterReadingJournalThreeMonthReport),
        component: meterReadingJournalThreeMonthReport
    }).$mount('#meterReadingJournalThreeMonth-report')
});

index.onDestroyed(function () {
    $('.meterReadingJournalThreeMonth-report').remove();
});