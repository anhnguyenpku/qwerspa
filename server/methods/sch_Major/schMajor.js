import {Sch_Major} from '../../../imports/collection/schMajor';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchMajor({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchMajor: 0,
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
            let shcMajors = Sch_Major.aggregate([
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
            if (shcMajors.length > 0) {
                data.content = shcMajors;
                let shcMajorTotal = Sch_Major.find(selector).count();
                data.countSchMajor = shcMajorTotal;
            }
            return data;
        }
    },
    querySchMajorById(id) {
        let data = Sch_Major.findOne({_id: id});
        return data;
    },
    insertSchMajor(data) {
        let doc = Sch_Major.insert(data);
        return doc;
    },
    updateSchMajor(data) {
        let doc = Sch_Major.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchMajor(id) {
        return Sch_Major.remove({_id: id});
    }
});