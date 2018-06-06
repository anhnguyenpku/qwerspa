import {Meteor} from 'meteor/meteor';
import {WB_MetersReading, VW_metersReading} from '../../../imports/collection/meterReading';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal';

Meteor.methods({
    fetchMeterReading(rolesArea) {
        let selector = {};
        let meterReadings = VW_metersReading.find({rolesArea: rolesArea}, {sort: {name: 1}}).fetch();
        let list = [];
        let index = 1;
        let userId = Meteor.userId();
        list.push({label: '(Please Choose)', value: ''});
        meterReadings.forEach(function (o) {
            if (o.assignUser && o.assignUser.indexOf(userId) > -1) {
                list.push({
                    label: `${o.name}`, value: o._id
                });
                index++;
            }

        });
        return list;
    },
    fetchUserAssign() {
        let userAssign = Meteor.users.find().fetch();
        let list = [];
        // list.push({label: '(Please Choose)', value: ''});
        userAssign.forEach(function (obj) {
            list.push({
                label: obj.username, value: obj._id
            })
        })
        return list;

    },
    meterQueryOptions({selector}) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        let meterQueries = WB_MetersReading.find(selector);
        meterQueries.forEach(function (doc) {
            let obj = {
                district: doc.districtId,
                block: doc.blockId,
                quartier: doc.quartierId,
                meterReadingId: doc._id
            }
            list.push({label: `${doc.name}`, value: JSON.stringify(obj)});
        });
        return list;
    },
    getDebtPayment(customerId, id, rolesArea) {
        let total = 0;
        let thisInvoice = WB_MeterReadingJournalDetail.findOne({customerId: customerId, _id: id, rolesArea: rolesArea});
        let meterReadingJournalDetails = WB_MeterReadingJournalDetail.find({
            _id: {$ne: id},
            newReadingDate: {$lt: thisInvoice.newReadingDate},
            customerId: customerId,
            rolesArea: rolesArea
        });
        meterReadingJournalDetails.forEach(function (md) {
            total += md.balance;
        });
        return total;
    }
});