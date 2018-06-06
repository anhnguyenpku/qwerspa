import './sch_subject.html';
import schSubject from '/imports/vue/ui/schSubject';

let indexTmpl = Template.sch_subject;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schSubject)
    }).$mount('sch_subject');
});

indexTmpl.onDestroyed(function () {
    $('.sch_subject').remove();
});

