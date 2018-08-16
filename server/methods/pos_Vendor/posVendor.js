import {Pos_Vendor} from '../../../imports/collection/posVendor';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosVendor({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosVendor: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {description: {$regex: reg, $options: 'mi'}}];
                }
            }
            let posVendors = Pos_Vendor.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                },
                {
                    $lookup: {
                        from: "pos_term",
                        localField: "termId",
                        foreignField: "_id",
                        as: "termDoc"
                    }
                },
                {
                    $unwind: {path: "$termDoc", preserveNullAndEmptyArrays: true}
                }
            ]);
            if (posVendors.length > 0) {
                data.content = posVendors;
                let posVendorTotal = Pos_Vendor.find(selector).count();
                data.countPosVendor = posVendorTotal;
            }
            return data;
        }
    },
    queryPosVendorById(id) {
        let data = Pos_Vendor.findOne({_id: id});
        return data;
    },
    insertPosVendor(data) {
        return Pos_Vendor.insert(data);
    },
    updatePosVendor(data) {
        return Pos_Vendor.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosVendor(id) {
        return Pos_Vendor.remove({_id: id});
    }
});