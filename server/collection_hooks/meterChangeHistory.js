import {WB_CustomerMeterChangeHistory} from '../../imports/collection/customerMeterChangeHistory';
import {WB_Customer} from '../../imports/collection/customer';
import {GeneralFunction} from '../../imports/api/methods/generalFunction';


WB_CustomerMeterChangeHistory.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generatePrefixId(WB_CustomerMeterChangeHistory, doc.rolesArea + '-' + `${doc.history.customerId}`, 5);
});

WB_CustomerMeterChangeHistory.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        WB_Customer.direct.update({_id: doc.history.customerId}, {
            $set: {
                contractUpdated: true,
                meterChangeHistoryId: doc._id,
                prevReadingDate: doc.newContract.date,
                prevReading: doc.newContract.newReading,
                'contract.meterTypeId': doc.newContract.meterTypeId,
                'contract.meterSerialNo': doc.newContract.meterSerial,
                'contract.meterInstallDate': doc.newContract.date,
                'contract.contractDate': doc.newContract.date,
                'contract.prevReading': doc.newContract.newReading,
            }
        });
    });
});