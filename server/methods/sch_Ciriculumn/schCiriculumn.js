import {Sch_Ciriculumn} from '../../../imports/collection/schCiriculumn';
import {Sch_CiriculumnReact} from '../../../imports/collection/schCiriculumn';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_BusRegisterReact} from "../../../imports/collection/schBusRegister";

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
        if (doc) {
            ciriculumnReact(doc);
        }
        return doc;
    },
    updateSchCiriculumn(data) {
        let doc = Sch_Ciriculumn.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            ciriculumnReact(data._id);
        }
        return doc;
    },
    removeSchCiriculumn(id) {
        let isRemoved = Sch_Ciriculumn.remove({_id: id});
        if (isRemoved) {
            ciriculumnReact(id);
        }
        return isRemoved;
    }
});


let ciriculumnReact = function (id) {
    let doc = Sch_CiriculumnReact.findOne();
    if (doc) {
        Sch_CiriculumnReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_CiriculumnReact.insert({
            id: id
        });
    }
}
