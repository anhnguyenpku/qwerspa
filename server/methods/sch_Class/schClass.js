import {Sch_Class} from '../../../imports/collection/schClass';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_ClassTable} from "../../../imports/collection/schClassTable";

Meteor.methods({
    querySchClass({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchClass: 0,
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
            let shcClasss = Sch_Class.aggregate([
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
            if (shcClasss.length > 0) {
                data.content = shcClasss;
                let shcClassTotal = Sch_Class.find(selector).count();
                data.countSchClass = shcClassTotal;
            }
            return data;
        }
    },
    querySchClassBoard({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchClass: 0,
            };
            let selector = {};
            selector.status = true;
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
            let shcClasss = Sch_Class.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: "sch_classTable",
                        localField: "_id",
                        foreignField: "classId",
                        as: "classTableDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$classTableDoc",
                        preserveNullAndEmptyArrays: true
                    }
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
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (shcClasss.length > 0) {
                data.content = shcClasss;
                let shcClassTotal = Sch_Class.find(selector).count();
                data.countSchClass = shcClassTotal;
            }
            return data;
        }
    },
    querySchClassById(id) {
        let data = Sch_Class.findOne({_id: id});
        return data;
    },
    insertSchClass(data) {
        let doc = Sch_Class.insert(data);
        return doc;
    },
    updateSchClass(data) {
        let doc = Sch_Class.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchClass(id) {
        return Sch_Class.remove({_id: id});
    },
    updateSchClassById(id) {
        return Sch_Class.update({_id: id}, {$set: {status: false}});
    }
});