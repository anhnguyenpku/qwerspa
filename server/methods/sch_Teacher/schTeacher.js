import {Sch_Teacher} from '../../../imports/collection/schTeacher';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchTeacher({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchTeacher: 0,
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
            let schTeachers = Sch_Teacher.aggregate([
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
            if (schTeachers.length > 0) {
                data.content = schTeachers;
                let schTeacherTotal = Sch_Teacher.find(selector).count();
                data.countSchTeacher = schTeacherTotal;
            }
            return data;
        }
    },
    querySchTeacherById(id) {
        let data = Sch_Teacher.findOne({_id: id});
        return data;
    },
    insertSchTeacher(data) {
        return Sch_Teacher.insert(data);
    },
    updateSchTeacher(data) {
        return Sch_Teacher.update({_id: data._id},
            {
                $set: data
            });
    },
    removeSchTeacher(id) {
        return Sch_Teacher.remove({_id: id});
    }
});