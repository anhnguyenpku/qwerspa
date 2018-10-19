import './posTableLocation.html';
import posTableLocation from '/imports/vue/ui/posTableLocation';

let indexTmpl = Template.pos_tableLocation;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posTableLocation)
    }).$mount('pos_tableLocation');
});

indexTmpl.onDestroyed(function () {
    $('.pos_tableLocation').remove();
});

