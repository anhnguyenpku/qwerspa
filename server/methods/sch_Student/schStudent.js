import {Sch_Student} from '../../../imports/collection/schStudent';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchStudent({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchStudent: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{
                        "personal.name": {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {"personal.latinName": {$regex: reg, $options: 'mi'}}
                        , {"personal.phoneNumber": {$regex: reg, $options: 'mi'}}

                    ];
                }
            }
            let schStudents = Sch_Student.aggregate([
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
            if (schStudents.length > 0) {
                data.content = schStudents;
                let schStudentTotal = Sch_Student.find(selector).count();
                data.countSchStudent = schStudentTotal;
            }
            return data;
        }
    },
    querySchStudentById(id) {
        let data = Sch_Student.findOne({_id: id});
        return data;
    },
    insertSchStudent(data) {
        return Sch_Student.insert(data);
    },
    updateSchStudent(data) {
        return Sch_Student.update({_id: data._id},
            {
                $set: data
            });
    },
    removeSchStudent(id) {
        return Sch_Student.remove({_id: id});
    }
});