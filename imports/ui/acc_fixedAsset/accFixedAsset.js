import './accFixedAsset.html';
import accFixedAsset from '/imports/vue/ui/accFixedAsset.vue';

let indexTmpl = Template.acc_fixedAsset;


indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(accFixedAsset)
    }).$mount('acc_fixedAsset');
});

indexTmpl.onDestroyed(function () {
    $('.acc_fixedAsset').remove();
});
