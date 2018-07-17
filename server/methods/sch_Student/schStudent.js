import {Sch_Student} from '../../../imports/collection/schStudent';
import {Sch_Transcript} from '../../../imports/collection/schTranscript';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Register} from "../../../imports/collection/schRegister";

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
    },
    inputTranscript(data) {

        let stateList = [];
        data.state.map((obj) => {
            if (obj.subjectId) {
                stateList.push(obj)
            }
        });
        data.state = stateList;
        let tranDoc = Sch_Transcript.findOne({studentId: data.studentId, majorId: data.majorId});
        let isReturn;
        if (tranDoc) {
            isReturn = Sch_Transcript.update({studentId: data.studentId, majorId: data.majorId}, {$set: data});
        } else {
            isReturn = Sch_Transcript.insert(data);
        }
        return isReturn;
    },
    queryTranscriptByStudentIdMajorId(studentId, majorId) {
        return Sch_Transcript.findOne({studentId: studentId, majorId: majorId});
    },
    queryStudentByProgram(programId) {
        let data = Sch_Register.aggregate([
            {
                $match: {programId: programId}
            },
            {
                $lookup: {
                    from: "sch_student",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "studentDoc"
                }
            }, {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        let newData = [];
        data.map((obj, index) => {
            newData.push({initial: obj._id, label: obj.studentDoc.personal.name, key: index});
        });
        return newData;
    }
});