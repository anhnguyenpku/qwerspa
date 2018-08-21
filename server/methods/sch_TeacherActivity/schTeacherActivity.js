import {Sch_TeacherActivity} from '../../../imports/collection/schTeacherActivity';

import {SpaceChar} from "../../../both/config.js/space"
import {Pos_Customer} from "../../../imports/collection/posCustomer";
import {Sch_Teacher} from "../../../imports/collection/schTeacher";

Meteor.methods({
    querySchTeacherActivity({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchTeacherActivity: 0,
            };
            let selector = {};
            let selectorTeacher = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selectorTeacher.$or = [{"personal.name": {$regex: reg, $options: 'mi'}}, {
                        "personal.khName": {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }];
                    let teacherList = Sch_Teacher.find(selectorTeacher, {_id: true},
                        {
                            $limit: options.limit
                        },
                        {
                            $skip: options.skip
                        }).fetch().map((obj) => {
                        return obj._id;
                    });

                    let activityList = Sch_Teacher.find({name: {$regex: reg, $options: 'mi'}}, {_id: true},
                        {
                            $limit: options.limit
                        },
                        {
                            $skip: options.skip
                        }).fetch().map((obj) => {
                        return obj._id;
                    });

                    selector.$or = [{teacherId: {$in: teacherList}}, {
                        activityId: {
                            $in: activityList
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcTeacherActivitys = Sch_TeacherActivity.aggregate([
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
                },
                {
                    $lookup: {
                        from: "sch_teacher",
                        localField: "teacherId",
                        foreignField: "_id",
                        as: "teacherDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$teacherDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "sch_activity",
                        localField: "activityId",
                        foreignField: "_id",
                        as: "activityDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$activityDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            if (shcTeacherActivitys.length > 0) {
                data.content = shcTeacherActivitys;
                let shcTeacherActivityTotal = Sch_TeacherActivity.find(selector).count();
                data.countSchTeacherActivity = shcTeacherActivityTotal;
            }
            return data;
        }
    }
    ,
    querySchTeacherActivityById(id) {
        let data = Sch_TeacherActivity.findOne({_id: id});
        return data;
    }
    ,
    insertSchTeacherActivity(data) {
        let doc = Sch_TeacherActivity.insert(data);
        return doc;
    }
    ,
    updateSchTeacherActivity(data) {
        let doc = Sch_TeacherActivity.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    }
    ,
    removeSchTeacherActivity(id) {
        return Sch_TeacherActivity.remove({_id: id});
    }
});