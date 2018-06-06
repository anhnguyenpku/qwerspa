import {Vue} from 'meteor/akryum:vue';
import Journal from '/imports/vue/ui/Journal.vue';
import EditMeterReadingJournal from '/imports/vue/components/meterReadingJournal/EditMeterReadingJournal.vue';
import NewMeterReadingJournal from '/imports/vue/components/meterReadingJournal/NewMeterReadingJournal.vue'
import Destroy from '/imports/vue/components/destroy/Destroy.vue';
import './meterReadingJournal.html';
import MeterWritingJournal from '/imports/vue/components/meterReadingJournal/MeterWritingJournal.vue';
import UploadMeterWritingJournal from '/imports/vue/components/meterReadingJournal/UploadMeterWritingJournal.vue';
Template.Wb_meterReadingJournal.onRendered(function () {
    new Vue({
        render: h => h(Journal),
        components: {
            Journal
        }
    }).$mount('#meterReadingJournal');
});
Template.Wb_meterReadingJournal.onDestroyed(function () {
    $('.journal').remove();
});

Template.Wb_meterReadingJournalNew.onRendered(function () {
    new Vue({
        render: h => h(NewMeterReadingJournal),
        components: {
            NewMeterReadingJournal
        }
    }).$mount('meterReadingNew');
});
Template.Wb_meterWritingJournal.onRendered(function () {
    new Vue({
        render: h => h(MeterWritingJournal),
        components: {
            MeterWritingJournal
        }
    }).$mount('#meter-writing-journal');
});
Template.Wb_meterWritingJournal.onDestroyed(function(){
    $('.meterWritingJournal').remove();
})

Template.Wb_meterReadingJournalNew.onDestroyed(function () {
    $('.new-meterReadingJournal').remove();
});



Template.Wb_uploadMeterWritingJournal.onRendered(function () {
    new Vue({
        render: h => h(UploadMeterWritingJournal),
        components: {
            UploadMeterWritingJournal
        }
    }).$mount('#upload-meter-writing-journal');
});
Template.Wb_uploadMeterWritingJournal.onDestroyed(function(){
    $('.uploadMeterWritingJournal').remove();
});
