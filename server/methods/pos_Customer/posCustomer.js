import {Pos_Customer} from '../../../imports/collection/posCustomer';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosCustomer({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosCustomer: 0,
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
            let posCustomers = Pos_Customer.aggregate([

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
            if (posCustomers.length > 0) {
                data.content = posCustomers;
                let posCustomerTotal = Pos_Customer.find(selector).count();
                data.countPosCustomer = posCustomerTotal;
            }
            return data;
        }
    },
    queryPosCustomerById(id) {
        let data = Pos_Customer.findOne({_id: id});
        return data;
    },
    insertPosCustomer(data) {
        return Pos_Customer.insert(data);
    },
    updatePosCustomer(data) {
        return Pos_Customer.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosCustomer(id) {
        return Pos_Customer.remove({_id: id});
    }
});