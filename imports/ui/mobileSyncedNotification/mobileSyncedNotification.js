import './mobileSyncedNotification.html';
import MobileSyncedNotification from '/imports/vue/ui/MobileSyncedNotification.vue'
Template.wb_mobileSyncedNotification.onRendered(function () {
    new Vue({
        el: '#mobile-synced-notification',
        render: h => h(MobileSyncedNotification)
    })
});

Template.wb_mobileSyncedNotification.onDestroyed(function () {
    $(".moible-synced-notification").empty();
});