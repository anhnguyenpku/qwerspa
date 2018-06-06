import {Meteor} from 'meteor/meteor';
import {WB_CustomerMeterChangeHistory} from '../../../imports/collection/customerMeterChangeHistory.js';
Meteor.methods({
    meterChangeReport(params){
            let selector = {};
            if (params.date) {
                let startDate = moment(params.date[0]).startOf('days').toDate();
                let endDate = moment(params.date[1]).endOf('days').toDate();
                selector.modifiedDate = {$gte: startDate, $lte: endDate};
            }
            let meterChanges= WB_CustomerMeterChangeHistory.aggregate([
                {$match: selector},
            ]);
            return meterChanges;
    }
});