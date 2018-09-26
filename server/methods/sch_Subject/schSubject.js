import {Sch_Subject} from '../../../imports/collection/schSubject';
import {Sch_SubjectReact} from '../../../imports/collection/schSubject';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_StudentReact} from "../../../imports/collection/schStudent";

Meteor.methods({
    querySchSubject({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchSubject: 0,
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
            let schSubjects = Sch_Subject.aggregate([
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
            if (schSubjects.length > 0) {
                data.content = schSubjects;
                let schSubjectTotal = Sch_Subject.find(selector).count();
                data.countSchSubject = schSubjectTotal;
            }
            return data;
        }
    },
    querySchSubjectById(id) {
        let data = Sch_Subject.findOne({_id: id});
        return data;
    },
    insertSchSubject(data) {
        let doc = Sch_Subject.insert(data);
        if (doc) {
            subjectReact(doc);
        }
        return doc;
    },
    updateSchSubject(data) {
        let id = data._id;
        let doc = Sch_Subject.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            subjectReact(id);
        }
        return doc;
    },
    removeSchSubject(id) {
        let isRemoved = Sch_Subject.remove({_id: id});
        if (isRemoved) {
            subjectReact(id);
        }
        return isRemoved;
    }
});


let subjectReact = function (id) {
    let doc = Sch_SubjectReact.findOne();
    if (doc) {
        Sch_SubjectReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_SubjectReact.insert({
            id: id
        });
    }
}