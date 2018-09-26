import {Sch_Time} from '../../../imports/collection/schTime';
import {Sch_TimeReact} from '../../../imports/collection/schTime';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_TeacherActivityReact} from "../../../imports/collection/schTeacherActivity";

Meteor.methods({
    querySchTime({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchTime: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcTimes = Sch_Time.aggregate([
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
            if (shcTimes.length > 0) {
                data.content = shcTimes;
                let shcTimeTotal = Sch_Time.find(selector).count();
                data.countSchTime = shcTimeTotal;
            }
            return data;
        }
    },
    querySchTimeById(id) {
        let data = Sch_Time.findOne({_id: id});
        return data;
    },
    insertSchTime(data) {
        let doc = Sch_Time.insert(data);
        if (doc) {
            timeReact(doc);
        }
        return doc;
    },
    updateSchTime(data) {
        let id = data._id;
        let doc = Sch_Time.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            timeReact(id);
        }
        return doc;
    },
    removeSchTime(id) {
        let isRemoved = Sch_Time.remove({_id: id});
        if (isRemoved) {
            timeReact(id);
        }
        return isRemoved;
    }
});


let timeReact = function (id) {
    let doc = Sch_TimeReact.findOne();
    if (doc) {
        Sch_TimeReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_TimeReact.insert({
            id: id
        });
    }
}