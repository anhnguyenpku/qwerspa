import {Sch_Register} from '../../../imports/collection/schRegister';
import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Class} from "../../../imports/collection/schClass";
import {Sch_Transcript} from "../../../imports/collection/schTranscript";
import {Sch_Level} from "../../../imports/collection/schLevel";

Meteor.methods({
    querySchRegister({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchRegister: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [
                        {"studentDoc.name": {$regex: reg, $options: 'mi'}},
                        {
                            "levelDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }, {
                            "programDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }];
                }
            }
            let shcRegisters = Sch_Register.aggregate([
                {
                    $lookup: {
                        from: "sch_student",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "studentDoc"

                    }
                },
                {
                    $unwind: {
                        path: "$studentDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "sch_program",
                        localField: "programId",
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
            if (shcRegisters.length > 0) {
                data.content = shcRegisters;
                let shcRegisterTotal = Sch_Register.aggregate([
                    {
                        $lookup: {
                            from: "sch_student",
                            localField: "studentId",
                            foreignField: "_id",
                            as: "studentDoc"

                        }
                    },
                    {
                        $unwind: {
                            path: "$studentDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "sch_program",
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
                        $lookup: {
                            from: "sch_level",
                            localField: "programId",
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
                        $match: selector
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {$sum: 1}
                        }
                    }
                ]);
                data.countSchRegister = shcRegisterTotal[0].total;
            }
            return data;
        }
    },
    querySchRegisterById(id) {
        let data = Sch_Register.findOne({_id: id});
        if (data.startClassDate === undefined) {
            data.startClassDate = "";
        }
        return data;
    },
    insertSchRegister(data) {
        let doc = Sch_Register.insert(data);
        return doc;
    },
    updateSchRegister(data) {
        let startClassDate = data.startClassDate;
        let rolesArea = data.rolesArea;
        let registerDateName = data.registerDateName;

        if (data.classId && data.classId !== "") {
            let registerDoc = Sch_Register.findOne({_id: data._id});
            let classTableDoc = Sch_ClassTable.findOne({classId: data.classId});
            let takeOutClassDoc = Sch_ClassTable.findOne({classId: registerDoc.classId});

            let classTBDoc = {};
            let classTBDocTakeOut = {};
            let studentList = [];
            let studentListTakeOut = [];
            classTBDoc.classId = data.classId;
            classTBDoc.rolesArea = data.rolesArea;
            let isGenerated = false;
            if (classTableDoc) {
                //Take In
                if (classTableDoc.studentList && classTableDoc.studentList.length > 0) {
                    classTableDoc.studentList.forEach((obj) => {
                        if (obj.isPromote === undefined) {
                            obj.isPromote = false;
                        }
                        if (obj._id !== registerDoc._id) {
                            studentList.push(obj);
                        } else {
                            isGenerated = true;
                        }
                    });
                }
                data.isGenerated = isGenerated;
                studentList.push(data);
                classTBDoc.studentList = studentList;
                Sch_ClassTable.update({_id: classTableDoc._id}, {$set: classTBDoc});
                //Take out
                if (takeOutClassDoc && (classTableDoc.classId !== takeOutClassDoc.classId)) {
                    if (takeOutClassDoc.studentList && takeOutClassDoc.studentList.length > 0) {
                        takeOutClassDoc.studentList.forEach((obj) => {
                            if (obj.isPromote === undefined) {
                                obj.isPromote = false;
                            }
                            if (obj._id !== registerDoc._id) {
                                studentListTakeOut.push(obj);
                            }
                        });
                    }
                    classTBDocTakeOut.studentList = studentListTakeOut;
                    Sch_ClassTable.update({_id: takeOutClassDoc._id}, {$set: classTBDocTakeOut});

                }
            } else {
                studentList.push(data);
                classTBDoc.studentList = studentList;
                Sch_ClassTable.insert(classTBDoc);

                //Take out
                if (takeOutClassDoc && (classTBDoc.classId !== takeOutClassDoc.classId)) {
                    if (takeOutClassDoc.studentList && takeOutClassDoc.studentList.length > 0) {
                        takeOutClassDoc.studentList.forEach((obj) => {
                            if (obj.isPromote === undefined) {
                                obj.isPromote = false;
                            }
                            if (obj._id !== registerDoc._id) {
                                studentListTakeOut.push(obj);
                            }
                        });
                    }
                    classTBDocTakeOut.studentList = studentListTakeOut;
                    Sch_ClassTable.update({_id: takeOutClassDoc._id}, {$set: classTBDocTakeOut});
                }
            }

            let levelDoc = Sch_Level.findOne({_id: registerDoc.levelId});
            let classDoc = Sch_Class.findOne({_id: data.classId});
            let newClassTableDoc = Sch_ClassTable.findOne({classId: data.classId});
            Meteor.call("schGeneratePaymentSchedule", classDoc, levelDoc, newClassTableDoc);
        }
        data.startClassDate = startClassDate;
        data.rolesArea = rolesArea;
        data.registerDateName = registerDateName;
        let doc = Sch_Register.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchRegister(id) {
        let registerDoc = Sch_Register.findOne({_id: id});
        if (registerDoc.classId) {
            let classTBDoc = {};
            let studentList = [];
            let classDoc = Sch_ClassTable.findOne({classId: registerDoc.classId});
            if (classDoc && classDoc.studentList && classDoc.studentList.length > 0) {
                classDoc.studentList.forEach((obj) => {
                    if (obj._id !== registerDoc._id) {
                        studentList.push(obj);
                    }
                });
                classTBDoc.studentList = studentList;
                Sch_ClassTable.update({_id: classDoc._id}, {$set: classTBDoc});
            }

        }
        Meteor.call("removePaymentScheduleByClassAndStudent", registerDoc.classId, registerDoc.studentId);
        Sch_Transcript.remove({registerId: id});
        return Sch_Register.remove({_id: id});
    }
});