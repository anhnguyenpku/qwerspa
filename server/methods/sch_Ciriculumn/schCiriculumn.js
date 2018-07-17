import {Sch_Ciriculumn} from '../../../imports/collection/schCiriculumn';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchCiriculumn({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchCiriculumn: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcCiriculumns = Sch_Ciriculumn.aggregate([
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
            if (shcCiriculumns.length > 0) {
                data.content = shcCiriculumns;
                let shcCiriculumnTotal = Sch_Ciriculumn.find(selector).count();
                data.countSchCiriculumn = shcCiriculumnTotal;
            }
            return data;
        }
    },
    querySchCiriculumnById(id) {
        let data = Sch_Ciriculumn.findOne({_id: id});
        return data;
    },
    insertSchCiriculumn(data) {
        let doc = Sch_Ciriculumn.insert(data);
        return doc;
    },
    updateSchCiriculumn(data) {
        console.log(data);
        let doc = Sch_Ciriculumn.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchCiriculumn(id) {
        return Sch_Ciriculumn.remove({_id: id});
    }
});