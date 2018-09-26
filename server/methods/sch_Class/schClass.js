import {Sch_Class} from '../../../imports/collection/schClass';
import {Sch_ClassReact} from '../../../imports/collection/schClass';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_ClassTable} from "../../../imports/collection/schClassTable";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";
import {Sch_CiriculumnReact} from "../../../imports/collection/schCiriculumn";

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
                },
                {
                    $lookup: {
                        from: "sch_time",
                        localField: "timeId",
                        foreignField: "_id",
                        as: "timeDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$timeDoc",
                        preserveNullAndEmptyArrays: true
                    }
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
    querySchClassBoard({q, filter, faculty, major, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchClass: 0,
            };
            let selector = {};
            selector.status = true;
            let selectorBoard = {};

            if (major !== "" && major !== undefined) {
                selectorBoard["levelDoc.majorId"] = major;

            }

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
                        classDateName: {
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
                    $lookup: {
                        from: "sch_level",
                        localField: "levelId",
                        foreignField: "_id",
                        as: "levelDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$levelDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: selectorBoard
                },
                {
                    $lookup: {
                        from: "sch_time",
                        localField: "timeId",
                        foreignField: "_id",
                        as: "timeDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$timeDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        "levelDoc.code": 1
                    }
                },
                {
                    $lookup: {
                        from: "sch_major",
                        localField: "levelDoc.majorId",
                        foreignField: "_id",
                        as: "majorDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$majorDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "sch_program",
                        localField: "majorDoc.programId",
                        foreignField: "_id",
                        as: "programDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$programDoc",
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
        if (doc) {
            classReact(doc);
        }
        return doc;
    },
    updateSchClass(data) {
        let id = data._id;
        let doc = Sch_Class.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            classReact(id);
        }
        return doc;
    },
    removeSchClass(id) {
        Sch_PaymentSchedule.remove({classId: id});
        Sch_ClassTable.remove({classId: id});
        let isRemoved = Sch_Class.remove({_id: id});
        if (isRemoved) {
            classReact(id);
        }
        return isRemoved;
    },
    updateSchClassById(id) {
        let isUpdated = Sch_Class.update({_id: id}, {$set: {status: false}});

        if (isUpdated) {
            classReact(id);
        }
        return isUpdated;
    }
});


let classReact = function (id) {
    let doc = Sch_ClassReact.findOne();
    if (doc) {
        Sch_ClassReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_ClassReact.insert({
            id: id
        });
    }
}
