import {Sch_Program} from '../../../imports/collection/schProgram';
import {Sch_ProgramReact} from '../../../imports/collection/schProgram';
import {Meteor} from 'meteor/meteor';
import {Promis} from 'meteor/promise';
import {SpaceChar} from "../../../both/config.js/space"
import {Sch_PositionReact} from "../../../imports/collection/schPosition";

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
        if (doc) {
            programReact(doc);
        }
        return doc;
    },
    updateSchProgram(data) {
        let id = data._id;
        let doc = Sch_Program.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            programReact(id);
        }
        return doc;
    },
    removeSchProgram(id) {
        let isRemoved = Sch_Program.remove({_id: id});
        if (isRemoved) {
            programReact(id);
        }
        return isRemoved;
    }
});


let programReact = function (id) {
    let doc = Sch_ProgramReact.findOne();
    if (doc) {
        Sch_ProgramReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_ProgramReact.insert({
            id: id
        });
    }
}