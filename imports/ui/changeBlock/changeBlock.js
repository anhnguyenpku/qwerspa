import './changeBlock.html';
import wbChangeBlock from '/imports/vue/ui/changeBlock';

let indexTmpl = Template.wb_changeBlock;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(wbChangeBlock)
    }).$mount('change-block');
});

indexTmpl.onDestroyed(function () {
    $('.change-block').remove();
});
