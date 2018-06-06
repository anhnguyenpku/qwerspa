import {Pos_Agent} from '../../../imports/collection/posAgent';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosAgent({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosAgent: 0,
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
            let posAgents = Pos_Agent.aggregate([
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
            if (posAgents.length > 0) {
                data.content = posAgents;
                let posAgentTotal = Pos_Agent.find(selector).count();
                data.countPosAgent = posAgentTotal;
            }
            return data;
        }
    },
    queryPosAgentById(id) {
        let data = Pos_Agent.findOne({_id: id});
        return data;
    },
    insertPosAgent(data) {
        return Pos_Agent.insert(data);
    },
    updatePosAgent(data) {
        return Pos_Agent.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosAgent(id) {
        return Pos_Agent.remove({_id: id});
    }
});