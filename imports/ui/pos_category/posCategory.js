import './posCategory.html';
import posCategory from '/imports/vue/ui/posCategory';

let indexTmpl = Template.pos_category;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posCategory)
    }).$mount('pos_category');
});

indexTmpl.onDestroyed(function () {
    $('.pos_category').remove();
});

