import './posLocation.html';
import posLocation from '/imports/vue/ui/posLocation';

let indexTmpl = Template.pos_location;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(posLocation)
    }).$mount('pos_location');
});

indexTmpl.onDestroyed(function () {
    $('.pos_location').remove();
});

