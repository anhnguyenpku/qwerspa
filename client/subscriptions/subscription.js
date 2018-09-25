Tracker.autorun(() => {
    Meteor.subscribe('manageModule');
    Meteor.subscribe('wb_waterBillingSetup', Session.get('area'));
    Meteor.subscribe('Acc_ExchangeActive', Session.get('area'));
    Meteor.subscribe('pos_invoiceExpired', Meteor.userId(), Session.get('area'));
    Meteor.subscribe('pos_inventoryNonStock', Meteor.userId(), Session.get('area'), Session.get("transactionActionNumber"));

    Meteor.subscribe('acc_chartAccountReact');

});
Meteor.subscribe('loginSetup');
// Meteor.subscribe('overdueCustomerCount');
