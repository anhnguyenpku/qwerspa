import './saving.html';
import Saving from '/imports/vue/ui/Saving.vue';
let index = Template.wb_customerSaving;


index.onRendered(function () {
    new Vue({
        render: h => h(Saving)
    }).$mount('#saving');
});
index.onDestroyed(function () {
    $('.saving').remove();
});