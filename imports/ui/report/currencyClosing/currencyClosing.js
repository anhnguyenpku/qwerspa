import currencyClosingReport from '/imports/vue/ui/report/currencyClosing';
import './currencyClosing.html';

let index = Template.acc_currencyClosingReport;
index.onRendered(function () {
    new Vue({
        render: h => h(currencyClosingReport),
        component: currencyClosingReport
    }).$mount('#currencyClosing-report')
});
index.onDestroyed(function () {
    $('.currencyClosing-report').remove();
});