import {Acc_Exchange} from '../../../imports/collection/accExchange';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryExchange({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countChartAccount: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{exDate: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }];
                }
            }
            let exchanges = Acc_Exchange.aggregate([
                {
                    $match: selector
                },

                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (exchanges.length > 0) {
                data.content = exchanges;
                let exchangesTotal = Acc_Exchange.find(selector).count();
                data.countExchange = exchangesTotal;
            }
            return data;
        }
    },
    queryExchangeById(id) {
        return Acc_Exchange.findOne({_id: id});
    },
    insertExchange(data) {
        if (data.status == true) {
            Acc_Exchange.update({status: true}, {
                $set: {
                    status: false
                },
                $multi: true
            })
        }
        return Acc_Exchange.insert(data);
    },
    updateExchange(data) {
        if (data.status == true) {
            Acc_Exchange.update({status: true}, {
                $set: {
                    status: false
                },
                $multi: true
            })
        }
        return Acc_Exchange.update({_id: data._id},
            {
                $set: data
            });
    },
    removeExchange(id) {
        return Acc_Exchange.remove({_id: id});
    }
});