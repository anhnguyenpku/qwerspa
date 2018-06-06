import './search.html';
import Search from '/imports/vue/ui/Search.vue';

let indexTmpl = Template.wb_search;

indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(Search)
    }).$mount('search');
});

indexTmpl.onDestroyed(function () {
    $('.search').remove();
});