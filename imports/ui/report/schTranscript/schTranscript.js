import schTranscriptReport from '/imports/vue/ui/report/schTranscript';
import './schTranscript.html';

let index = Template.sch_transcriptReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schTranscriptReport),
        component: schTranscriptReport
    }).$mount('#schTranscript-report')
});

index.onDestroyed(function () {
    $('.schTranscript-report').remove();
});