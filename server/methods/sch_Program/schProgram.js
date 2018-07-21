import {Sch_Program} from '../../../imports/collection/schProgram';
import {Meteor} from 'meteor/meteor';
import {Promis} from 'meteor/promise';
import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchProgram({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchProgram: 0,
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
            let schPrograms = Sch_Program.aggregate([
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
            if (schPrograms.length > 0) {
                data.content = schPrograms;
                let schProgramTotal = Sch_Program.find(selector).count();
                data.countSchProgram = schProgramTotal;

            }
            return data;

        }
    },
    querySchProgramById(id) {
        let data = Sch_Program.findOne({_id: id});
        return data;
    },
    insertSchProgram(data) {
        let doc = Sch_Program.insert(data);
        return doc;
    },
    updateSchProgram(data) {
        let doc = Sch_Program.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchProgram(id) {
        return Sch_Program.remove({_id: id});
    }
});