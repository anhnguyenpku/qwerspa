import Payment from '../../imports/api/methods/payment';
import RequestCuttingWater from '../../imports/api/methods/requestCuttingWater';
SyncedCron.add({
    name: 'Generate Overdue Customer',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 5 minutes');
        return parser.text('at 11:00 pm');
    },
    job: function () {
       Meteor.call('payment_overdueCustomer');
    }
});