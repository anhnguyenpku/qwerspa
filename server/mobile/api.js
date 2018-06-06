import MobileApi from '../../imports/api/methods/mobile';
import PaymentApi from '../../imports/api/methods/payment'
import {WB_MetersReading} from "../../imports/collection/meterReading";
import {WB_RequestCuttingWater} from "../../imports/collection/requestCuttingWater";

Meteor.methods({
    api_checkUserLogin(username, password) {
        return MobileApi.queryUserByUsername(username, password);
    },
    api_checkRoles(userId, roles) {
        return MobileApi.checkRoles(userId, roles);
    },
    api_lookupJournalBook(userId, rolesArea, uuids) {
        let roles = MobileApi.checkRoles(userId, 'meterReader');
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        return MobileApi.JournalBookByUser(userId, rolesArea, uuids)
    },
    api_updateJournalBooksLastSynced(uuids, lastSynced, userId) {
        return MobileApi.updateJournalBooksLastSynced(uuids, lastSynced, userId);
    },
    api_lookupJournalDetail(meterReadingJournalId) {
        return MobileApi.lookupJournalDetails(meterReadingJournalId);
    },
    api_syncJournalDetailToServer(journalBookId, journalDetails, userId) {
        let journalBook = MobileApi.lookupJournalBookDoc({_id: journalBookId});
        if (journalBook && journalBook.isLocked) {
            throw new Meteor.Error('ប្លុកនេះត្រូវបានបិទមិនអោយកែប្រែ');
        }
        return MobileApi.syncJournalDetailToServer(journalBookId, journalDetails, userId);
    },
    api_fetchDescription() {
        return MobileApi.fetchDescription(); //empty selector to fetch all
    },
    //lookup journal detail history by customer within 3 months
    api_lookupJournalDetailHistoryByCustomerId(uuid, customerId, userId) {
        let roles = MobileApi.checkRoles(userId, 'meterReader');
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        return MobileApi.lookupJournalDetailHistoryByCustomerId(uuid, customerId);
    },
    //unpaid customer
    api_creditor_meterReading(userId, rolesArea, cond) {
        let roles = MobileApi.checkRoles(userId, 'creditor');
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        return MobileApi.creditorJournalBook(userId, rolesArea, cond);
    },
    api_payment_unpaid_customer(userId, blockId, querySelector, page, q) {
        let roles = MobileApi.checkRoles(userId, ['creditor']);
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        let user = Meteor.users.findOne({_id: userId});
        return {
            waterBillingSetup: PaymentApi.waterBillingSetup(user),
            unpaid: PaymentApi.unpaidCustomer(user, blockId, querySelector, page, q)
        };
    },
    api_setting_waterBillingSetup(userId) {
        let roles = MobileApi.checkRoles(userId, ['creditor']);
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        let user = Meteor.users.findOne({_id: userId});
        return PaymentApi.waterBillingSetup(user);
    },
    api_toggleSwitchOffWater(userId, customerId, journalBookDetailId, toggle,desc) {
        let roles = MobileApi.checkRoles(userId, ['creditor']);
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        return PaymentApi.toggleSwitchOffWater(customerId, journalBookDetailId, toggle,desc, userId);
    },
    api_toggleSwitchOnWater(userId, customerId, journalBookDetailId, toggle) {
        let roles = MobileApi.checkRoles(userId, ['creditor']);
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        return PaymentApi.toggleSwitchOnWater(customerId, journalBookDetailId, toggle, userId)
    },
    api_overdueCustomerCount(userId, selector = {status: 'active', isCutOff: true}) {
        let roles = MobileApi.checkRoles(userId, ['creditor']);
        if (!roles) {
            throw new Meteor.Error('អ្នកពុំមានសិទ្ធ!សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង')
        }
        let meterReadings = WB_MetersReading.find({assignUser: {$in: [userId || this.userId]}}).fetch();
        let blocks = meterReadings.map(o => o.blockId);
        selector.blockId = {$in: blocks};
        if (blocks.length > 0) {
            return WB_RequestCuttingWater.find(selector).count();
        }
    }
});