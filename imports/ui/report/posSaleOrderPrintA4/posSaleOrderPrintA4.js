import posSaleOrderPrintA4Report from '/imports/vue/ui/report/posSaleOrderPrintA4';
import './posSaleOrderPrintA4.html';

let index = Template.pos_saleOrderPrintA4Report;
index.onRendered(function () {
    new Vue({
        render: h => h(posSaleOrderPrintA4Report),
        component: posSaleOrderPrintA4Report
    }).$mount('#posSaleOrderPrintA4-report')
});

index.onDestroyed(function () {
    $('.posSaleOrderPrintA4-report').remove();
});