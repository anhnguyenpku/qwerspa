import {WB_Customer} from '../../../imports/collection/customer';
import {WB_CustomerMeterChangeHistory} from '../../../imports/collection/customerMeterChangeHistory';

Meteor.methods({
    queryCustomer({q, filter, options = {limit: 10, skip: 0}, rolesArea}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                count: 0,
            };
            let selector = {rolesArea};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {khName: {$regex: reg, $options: 'mi'}}];
                }
            }
            let customers = WB_Customer.aggregate([
                {
                    $match: selector
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                },
                {
                    $sort: {dpc: 1}
                },
                {
                    $lookup: {
                        from: 'wb_category',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDoc'
                    }
                }, {
                    $lookup: {
                        from: 'wb_tariff',
                        localField: 'tariff',
                        foreignField: '_id',
                        as: 'tariffDoc'
                    }
                }, {
                    $lookup: {
                        from: 'wb_class',
                        localField: 'class',
                        foreignField: '_id',
                        as: 'classDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_district',
                        localField: 'district',
                        foreignField: '_id',
                        as: 'districtDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_quartier',
                        localField: 'quartier',
                        foreignField: '_id',
                        as: 'quartierDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_block',
                        localField: 'block',
                        foreignField: '_id',
                        as: 'blockDoc'
                    }
                },
                {$unwind: {path: '$categoryDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$classDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$tariffDoc', preserveNullAndEmptyArrays: true}},
                {$sort: {name: 1}}
            ]);
            if (customers.length > 0) {
                data.content = customers;
            }
            return data;
        }
    },
    countCustomer({q, filter, options = {limit: 10, skip: 0}, rolesArea}) {
        let selector = {rolesArea};
        if (!!q) {
            let reg = new RegExp(q, 'i');
            if (!!filter) {
                selector[filter] = {$regex: reg}
            } else {
                selector.$or = [{name: {$regex: reg}}, {khName: {$regex: reg}}];
            }
        }
        return WB_Customer.find(selector).count();
    },
    insertMeterChange({rolesArea, meterChange, oldMeterChange, modifiedDate}) {
        return WB_CustomerMeterChangeHistory.insert({
            modifiedDate,
            history: oldMeterChange,
            newContract: meterChange,
            rolesArea
        });
    }
});