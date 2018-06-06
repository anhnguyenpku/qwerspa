SyncedCron.add({
    name: 'Clear Unfinished work',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 5 minutes');
        return parser.text('at 8:00 pm');
    },
    job: function () {
        Meteor.call('removeCurrentWorkPayment',{selector: {}});
    }
});