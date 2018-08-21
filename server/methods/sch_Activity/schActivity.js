import {Sch_Activity} from '../../../imports/collection/schActivity';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchActivity({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchActivity: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {
                        khName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcActivitys = Sch_Activity.aggregate([
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
            if (shcActivitys.length > 0) {
                data.content = shcActivitys;
                let shcActivityTotal = Sch_Activity.find(selector).count();
                data.countSchActivity = shcActivityTotal;
            }
            return data;
        }
    },
    querySchActivityById(id) {
        let data = Sch_Activity.findOne({_id: id});
        return data;
    },
    insertSchActivity(data) {
        let doc = Sch_Activity.insert(data);
        return doc;
    },
    updateSchActivity(data) {
        let doc = Sch_Activity.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchActivity(id) {
        return Sch_Activity.remove({_id: id});
    }
});