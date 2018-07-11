import './sch_promotion.html';
import schPromotion from '/imports/vue/ui/schPromotion';

let indexTmpl = Template.sch_promotion;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schPromotion)
    }).$mount('sch_promotion');
});

indexTmpl.onDestroyed(function () {
    $('.sch_promotion').remove();
});

