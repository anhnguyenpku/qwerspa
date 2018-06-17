import './sch_mention.html';
import schMention from '/imports/vue/ui/schMention';

let indexTmpl = Template.sch_mention;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schMention)
    }).$mount('sch_mention');
});

indexTmpl.onDestroyed(function () {
    $('.sch_mention').remove();
});

