import {Sch_Position} from '../../../imports/collection/schPosition';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchPosition({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchPosition: 0,
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
            let shcPositions = Sch_Position.aggregate([
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
            if (shcPositions.length > 0) {
                data.content = shcPositions;
                let shcPositionTotal = Sch_Position.find(selector).count();
                data.countSchPosition = shcPositionTotal;
            }
            return data;
        }
    },
    querySchPositionById(id) {
        let data = Sch_Position.findOne({_id: id});
        return data;
    },
    insertSchPosition(data) {
        let doc = Sch_Position.insert(data);
        return doc;
    },
    updateSchPosition(data) {
        let doc = Sch_Position.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchPosition(id) {
        return Sch_Position.remove({_id: id});
    }
});