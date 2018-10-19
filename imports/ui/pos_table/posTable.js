import './posTable.html';
import posTable from '/imports/vue/ui/posTable';

let indexTmpl = Template.pos_table;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posTable)
    }).$mount('pos_table');
});

indexTmpl.onDestroyed(function () {
    $('.pos_table').remove();
});

