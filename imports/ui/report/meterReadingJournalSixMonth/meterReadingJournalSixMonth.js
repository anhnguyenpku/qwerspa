import meterReadingJournalSixMonthReport from '/imports/vue/ui/report/meterReadingJournalSixMonth';
import './meterReadingJournalSixMonth.html';
let index = Template.wb_meterReadingJournalSixMonthReport;
index.onRendered(function () {
    new Vue({
        render: h => h(meterReadingJournalSixMonthReport),
        component: meterReadingJournalSixMonthReport
    }).$mount('#meterReadingJournalSixMonth-report')
});

index.onDestroyed(function () {
    $('.meterReadingJournalSixMonth-report').remove();
});