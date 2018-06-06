import './description.html';

import Description from '/imports/vue/ui/Description.vue';


Template.wb_description.onRendered(function () {
    new Vue({
        el: '#description',
        render: h => h(Description)
    });
});

Template.wb_description.onDestroyed(function () {
    $('.description').empty();
});