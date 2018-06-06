import {Pos_Unit} from '../../../imports/collection/posUnit';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosUnit({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosUnit: 0,
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
                    }, {note: {$regex: reg, $options: 'mi'}}];
                }
            }
            let posUnits = Pos_Unit.aggregate([
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
            if (posUnits.length > 0) {
                data.content = posUnits;
                let posUnitTotal = Pos_Unit.find(selector).count();
                data.countPosUnit = posUnitTotal;
            }
            return data;
        }
    },
    queryPosUnitById(id) {
        let data = Pos_Unit.findOne({_id: id});
        return data;
    },
    insertPosUnit(data) {
        return Pos_Unit.insert(data);
    },
    updatePosUnit(data) {
        return Pos_Unit.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosUnit(id) {
        return Pos_Unit.remove({_id: id});
    }
});