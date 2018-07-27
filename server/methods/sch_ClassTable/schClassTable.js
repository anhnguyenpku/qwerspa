import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Register} from "../../../imports/collection/schRegister";
import {Sch_Class} from "../../../imports/collection/schClass";
import {Sch_Level} from "../../../imports/collection/schLevel";

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
                $lookup: {
                    from: "sch_class",
                    localField: "studentList.newClassId",
                    foreignField: "_id",
                    as: "newClassDoc"
                }
            }, {
                $unwind: {
                    path: "$newClassDoc",
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
                if (obj.studentList && obj.studentList.isPromote === false || obj.studentList && obj.studentList.isPromote === undefined) {
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
    },
    addPromoteToClass(data) {
        if (data) {
            let classTableDoc = Sch_ClassTable.findOne({classId: data.classFormDoc.classId});
            let classDoc = Sch_Class.findOne({_id: data.classFormDoc.classId});
            let classTable = {};
            classTable.classId = data.classFormDoc.classId;
            classTable.rolesArea = data.classFormDoc.rolesArea;
            let studentList = [];
            if (classTableDoc) {
                studentList = classTableDoc.studentList;
            }
            data.studentList.forEach((obj) => {
                if (obj) {
                    data.classFormDoc.studentId = obj.studentList.studentId;
                    data.classFormDoc._id = obj.studentList._id;
                    data.classFormDoc.promotionId = obj.studentList.promotionId;
                    data.classFormDoc.term = obj.studentList.term;
                    data.classFormDoc.registerDate = classDoc.classDate;
                    data.classFormDoc.isPromote = false;
                    data.classFormDoc.isChangeClass = false;

                    studentList.push(data.classFormDoc);
                    Sch_ClassTable.direct.update({
                        "studentList.studentId": obj.studentList.studentId,
                        "studentList.programId": obj.studentList.programId,
                        "studentList.classId": obj.studentList.classId,
                        "studentList.levelId": obj.studentList.levelId,
                        "studentList.majorId": obj.studentList.majorId
                    }, {$set: {"studentList.$.isPromote": true, "studentList.$.newClassId": data.classFormDoc.classId}})
                }
            });

            classTable.studentList = studentList;
            if (classTableDoc) {
                let d = Sch_ClassTable.update({_id: classTableDoc._id}, {$set: classTable});
                let ndwSchClassTableDoc = Sch_ClassTable.findOne({_id: classTableDoc._id});
                let levelDoc = Sch_Level.findOne({_id: data.classFormDoc.levelId});
                Meteor.call("schGeneratePaymentSchedule", classDoc, levelDoc, ndwSchClassTableDoc);
                return d;
            } else {
                let d = Sch_ClassTable.insert(classTable);
                let ndwSchClassTableDoc = Sch_ClassTable.findOne({_id: d});
                let levelDoc = Sch_Level.findOne({_id: data.classFormDoc.levelId});
                Meteor.call("schGeneratePaymentSchedule", classDoc, levelDoc, ndwSchClassTableDoc);
                return d;
            }

        }
    }
});