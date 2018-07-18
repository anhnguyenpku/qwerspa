import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Register} from "../../../imports/collection/schRegister";

Meteor.methods({
    querySchClassTable({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchClassTable: 0,
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
            let shcClassTables = Sch_ClassTable.aggregate([
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
            if (shcClassTables.length > 0) {
                data.content = shcClassTables;
                let shcClassTableTotal = Sch_ClassTable.find(selector).count();
                data.countSchClassTable = shcClassTableTotal;
            }
            return data;
        }
    },
    querySchClassTableById(id) {
        let data = Sch_ClassTable.findOne({_id: id});
        return data;
    },
    insertSchClassTable(data) {
        let doc = Sch_ClassTable.insert(data);
        return doc;
    },
    updateSchClassTable(data) {
        let doc = Sch_ClassTable.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchClassTable(id) {
        return Sch_ClassTable.remove({_id: id});
    },
    queryStudentByClassId(classId) {
        let data = Sch_ClassTable.aggregate([
            {
                $match: {classId: classId}
            },
            {
                $unwind: {
                    path: "$studentList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "sch_student",
                    localField: "studentList.studentId",
                    foreignField: "_id",
                    as: "studentDoc"
                }
            }, {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "studentDoc.personal.name": 1
                }
            }
        ]);
        /*let newData = [];
        data.map((obj, index) => {
            newData.push({initial: obj._id, label: obj.studentDoc.personal.name, key: index});
        });*/
        let dataNotPromote = [];
        let dataPromote = [];
        if (data) {
            data.forEach((obj) => {
                if (obj.studentList.isPromote === false || obj.studentList.isPromote === undefined) {
                    dataNotPromote.push(obj);
                } else {
                    dataPromote.push(obj);
                }
            })
        }
        let newData = {};
        newData.data = data;
        newData.dataNotPromote = dataNotPromote;
        newData.dataPromote = dataPromote;
        return newData;
    }
});