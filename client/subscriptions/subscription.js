Tracker.autorun(() => {
    Meteor.subscribe('wb_waterBillingSetup', Session.get('area'));
    Meteor.subscribe('Acc_ExchangeActive', Session.get('area'));
    Meteor.subscribe('pos_invoiceExpired', Meteor.userId(), Session.get('area'));
    Meteor.subscribe('pos_inventoryNonStock', Meteor.userId(), Session.get('area'), Session.get("transactionActionNumber"));
});
Meteor.subscribe('wb_tariffPub');
Meteor.subscribe('pub_categories');
Meteor.subscribe('mobileSynced_notify');
Meteor.subscribe('requestUpdateJournalDetail');
Meteor.subscribe('loginSetup');
// Meteor.subscribe('overdueCustomerCount');
