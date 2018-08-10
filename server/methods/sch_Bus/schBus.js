import {Sch_Bus} from '../../../imports/collection/schBus';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchBus({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchBus: 0,
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
                    }, {
                        contact: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let schBuss = Sch_Bus.aggregate([
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
                }
            ]);
            if (schBuss.length > 0) {
                data.content = schBuss;
                let schBusTotal = Sch_Bus.find(selector).count();
                data.countSchBus = schBusTotal;
            }
            return data;
        }
    },
    querySchBusById(id) {
        let data = Sch_Bus.findOne({_id: id});
        return data;
    },
    insertSchBus(data) {
        let doc = Sch_Bus.insert(data);
        return doc;
    },
    updateSchBus(data) {
        let doc = Sch_Bus.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchBus(id) {
        return Sch_Bus.remove({_id: id});
    }
});