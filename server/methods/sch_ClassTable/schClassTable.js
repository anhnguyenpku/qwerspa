import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Register} from "../../../imports/collection/schRegister";
import {Sch_Class} from "../../../imports/collection/schClass";
import {Sch_Level} from "../../../imports/collection/schLevel";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";

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
                if (obj && obj.studentList && obj.studentList.studentId) {
                    if (obj.studentList && obj.studentList.isPromote === false || obj.studentList && obj.studentList.isPromote === undefined) {
                        dataNotPromote.push(obj);
                    } else {
                        dataPromote.push(obj);
                    }
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
                studentList = classTableDoc.studentList || [];
            }
            data.studentList.forEach((obj) => {
                if (obj) {


                    studentList.push({
                        levelId: data.classFormDoc.levelId,
                        majorId: data.classFormDoc.majorId,
                        programId: data.classFormDoc.programId,
                        classId: data.classFormDoc.classId,
                        startClassDate: data.classFormDoc.startClassDate,
                        rolesArea: data.classFormDoc.rolesArea,

                        studentId: obj.studentList.studentId,
                        _id: obj.studentList._id,
                        promotionId: obj.studentList.promotionId,
                        term: obj.studentList.term,
                        registerDate: classDoc.classDate,
                        isPromote: false,
                        isChangeClass: false,
                        status: "Active"

                    })

                    Sch_ClassTable.direct.update({
                        "studentList.studentId": obj.studentList.studentId,
                        "studentList.programId": obj.studentList.programId,
                        "studentList.classId": obj.studentList.classId,
                        "studentList.levelId": obj.studentList.levelId,
                        "studentList.majorId": obj.studentList.majorId
                    }, {
                        $set: {
                            "studentList.$.isPromote": true,
                            "studentList.$.newClassId": data.classFormDoc.classId,
                            "studentList.$.status": "Pass",

                        }
                    })
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
    },
    addUnPromoteToClass(data) {
        if (data) {
            let classTableDoc = Sch_ClassTable.findOne({classId: data.classFormDoc.classId});
            let classDoc = Sch_Class.findOne({_id: data.classFormDoc.classId});
            let classTable = {};
            classTable.classId = data.classFormDoc.classId;
            classTable.rolesArea = data.classFormDoc.rolesArea;
            let studentList = [];
            if (classTableDoc) {
                studentList = classTableDoc.studentList || [];
            }
            data.studentList.forEach((obj) => {
                if (obj) {

                    studentList.push({
                        levelId: data.classFormDoc.levelId,
                        majorId: data.classFormDoc.majorId,
                        programId: data.classFormDoc.programId,
                        classId: data.classFormDoc.classId,
                        startClassDate: data.classFormDoc.startClassDate,
                        rolesArea: data.classFormDoc.rolesArea,

                        studentId: obj.studentList.studentId,
                        _id: obj.studentList._id,
                        promotionId: obj.studentList.promotionId,
                        term: obj.studentList.term,
                        registerDate: classDoc.classDate,
                        isPromote: false,
                        isChangeClass: false,
                        status: "Active"

                    })


                    Sch_ClassTable.direct.update({
                        "studentList.studentId": obj.studentList.studentId,
                        "studentList.programId": obj.studentList.programId,
                        "studentList.classId": obj.studentList.classId,
                        "studentList.levelId": obj.studentList.levelId,
                        "studentList.majorId": obj.studentList.majorId
                    }, {
                        $set: {
                            "studentList.$.isPromote": true,
                            "studentList.$.newClassId": data.classFormDoc.classId,
                            "studentList.$.status": "Fail",

                        }
                    })
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
    },
    addPromoteToGraduated(data) {
        if (data) {
            data.studentList.forEach((obj) => {
                if (obj) {
                    let re = Sch_ClassTable.direct.update({
                        "studentList.studentId": obj.studentList.studentId,
                        "studentList.programId": obj.studentList.programId,
                        "studentList.classId": obj.studentList.classId,
                        "studentList.levelId": obj.studentList.levelId,
                        "studentList.majorId": obj.studentList.majorId
                    }, {
                        $set: {
                            "studentList.$.isPromote": true,
                            "studentList.$.newClassId": obj.studentList.classId,
                            "studentList.$.status": "Graduated"
                        }
                    });
                }
            });
        }
    },
    updateStudentStatus(data, status) {
        if (data) {
            if (status === "Suspend" || status === "Dropout") {
                let payDoc = Sch_PaymentSchedule.findOne({
                    studentId: data.studentId,
                    classId: data.classId
                });
                Sch_PaymentSchedule.direct.update({
                    studentId: data.studentId,
                    classId: data.classId
                }, {$set: {status: "Complete", oldStatus: payDoc.status}}, {multi: true});
            } else {
                let payDoc = Sch_PaymentSchedule.findOne({
                    studentId: data.studentId,
                    classId: data.classId
                });
                Sch_PaymentSchedule.direct.update({
                    studentId: data.studentId,
                    classId: data.classId
                }, {$set: {status: payDoc.oldStatus,}}, {multi: true});
            }
            return Sch_ClassTable.direct.update({
                "studentList.studentId": data.studentId,
                "studentList.programId": data.programId,
                "studentList.classId": data.classId,
                "studentList.levelId": data.levelId,
                "studentList.majorId": data.majorId
            }, {
                $set: {
                    "studentList.$.status": status
                }
            });
        }

    },
    removeSchStudentFromClass(classId, studentId) {
        let classTableDoc = Sch_ClassTable.findOne({classId: classId});
        let studentList = [];
        if (classTableDoc) {
            classTableDoc.studentList.forEach((obj) => {
                if (obj.studentId !== studentId) {
                    studentList.push(obj);
                }
            });
            Sch_PaymentSchedule.direct.remove({classId: classId, studentId: studentId});
            return Sch_ClassTable.direct.update({classId: classId}, {$set: {studentList: studentList}});
        }
        return false;

    }

});