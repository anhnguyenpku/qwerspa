import {Sch_Level} from '../../../imports/collection/schLevel';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchLevel({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchLevel: 0,
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
                        khName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let schLevels = Sch_Level.aggregate([
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
            if (schLevels.length > 0) {
                data.content = schLevels;
                let schLevelTotal = Sch_Level.find(selector).count();
                data.countSchLevel = schLevelTotal;
            }
            return data;
        }
    },
    querySchLevelById(id) {
        let data = Sch_Level.findOne({_id: id});
        return data;
    },
    insertSchLevel(data) {
        let doc = Sch_Level.insert(data);
        return doc;
    },
    updateSchLevel(data) {
        let doc = Sch_Level.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchLevel(id) {
        return Sch_Level.remove({_id: id});
    }
});