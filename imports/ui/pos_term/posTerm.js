import './posTerm.html';
import posTerm from '/imports/vue/ui/posTerm';

let indexTmpl = Template.pos_term;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posTerm)
    }).$mount('pos_term');
});

indexTmpl.onDestroyed(function () {
    $('.pos_term').remove();
});

