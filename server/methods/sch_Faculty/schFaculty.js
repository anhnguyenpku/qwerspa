import {Sch_Faculty} from '../../../imports/collection/schFaculty';
import {Sch_FacultyReact} from '../../../imports/collection/schFaculty';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_ClassTableReact} from "../../../imports/collection/schClassTable";

Meteor.methods({
    querySchFaculty({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchFaculty: 0,
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
            let shcFacultys = Sch_Faculty.aggregate([
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
            if (shcFacultys.length > 0) {
                data.content = shcFacultys;
                let shcFacultyTotal = Sch_Faculty.find(selector).count();
                data.countSchFaculty = shcFacultyTotal;
            }
            return data;
        }
    },
    querySchFacultyById(id) {
        let data = Sch_Faculty.findOne({_id: id});
        return data;
    },
    insertSchFaculty(data) {
        let doc = Sch_Faculty.insert(data);
        if (doc) {
            facultyReact(doc);
        }
        return doc;
    },
    updateSchFaculty(data) {
        let id = data._id;
        let doc = Sch_Faculty.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            facultyReact(id);
        }
        return doc;
    },
    removeSchFaculty(id) {
        let isRemoved = Sch_Faculty.remove({_id: id});
        if (isRemoved) {
            facultyReact(id);
        }
        return isRemoved;
    }
});


let facultyReact = function (id) {
    let doc = Sch_FacultyReact.findOne();
    if (doc) {
        Sch_FacultyReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_FacultyReact.insert({
            id: id
        });
    }
}