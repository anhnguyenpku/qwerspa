import './requestUpdateJournalDetail.html';
import RequestUpdateJournalDetail from '/imports/vue/ui/RequestUpdateJournalDetail.vue';

Template.wb_requestUpdateJournalDetail.onRendered(function () {
    new Vue({
        render: h => h(RequestUpdateJournalDetail)
    }).$mount('request-update');
});

Template.wb_requestUpdateJournalDetail.onDestroyed(function () {
    $('.request-update').empty();
});