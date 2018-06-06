import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer';
Meteor.methods({
    customerReport(params){
        if (Meteor.userId()) {
            Meteor._sleepForMs(200);
            let selector = {};
            if (params.district && params.district != '') {
                selector.district = params.district;
            }
            if (params.quartier && params.quartier != '') {
                selector.quartier = params.quartier;
            }
            if (params.block && params.block != '') {
                selector.block = params.block;
            }
            return WB_Customer.aggregate([
                {$match: selector},
                {
                    $lookup: {
                        from: 'wb_district',
                        localField: 'district',
                        foreignField: '_id',
                        as: 'districtDoc',
                    }
                }, {
                    $lookup: {
                        from: 'wb_quartier',
                        localField: 'quartier',
                        foreignField: '_id',
                        as: 'quartierDoc',
                    }
                }, {
                    $lookup: {
                        from: 'wb_block',
                        localField: 'block',
                        foreignField: '_id',
                        as: 'blockDoc',
                    }
                },
                {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}}
            ]);
        }
        return [];
    }
});