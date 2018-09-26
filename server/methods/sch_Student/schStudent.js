import {Sch_Student} from '../../../imports/collection/schStudent';
import {Sch_StudentReact} from '../../../imports/collection/schStudent';
import {Sch_Transcript} from '../../../imports/collection/schTranscript';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Register, Sch_RegisterReact} from "../../../imports/collection/schRegister";
import {Pos_Invoice} from "../../../imports/collection/posInvoice";

Meteor.methods({
    querySchStudent({q, filter, options = {limit: 10, skip: 0}, sortItem}) {
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

            let selectorSort = {};
            if (sortItem === "createdAt") {
                selectorSort = {createdAt: -1};

            } else if (sortItem === "latinName") {
                selectorSort = {"personal.latinName": 1}
            } else if (sortItem === "name") {
                selectorSort = {"personal.name": 1}
            }

            let schStudents = Sch_Student.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: selectorSort
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
        data.personal.code = pad(data.personal.code + "", 6);
        let isInserted = Sch_Student.insert(data);
        if (isInserted) {
            studentReact(isInserted);
        }
        return isInserted;
    },
    updateSchStudent(data) {
        let id = data._id;
        data.personal.code = pad(data.personal.code + "", 6);
        let isUpdated = Sch_Student.update({_id: data._id},
            {
                $set: data
            });
        if (isUpdated) {
            studentReact(id);
        }
        return isUpdated;
    },
    removeSchStudent(id) {
        let isRemoved = Sch_Student.remove({_id: id});
        if (isRemoved) {
            studentReact(id);
        }
        return isRemoved;
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
    },
    sch_getIdStudent(rolesAreas) {
        let data = Sch_Student.findOne({
            rolesArea: rolesAreas,
        }, {sort: {"personal.code": -1}});
        let code = parseInt(data && data.personal.code || "0") + 1;
        return pad(code + "", 6);

    },
    sch_updateStudentImageURlById(id, url) {
        let isUpdated = Sch_Student.direct.update({_id: id}, {$set: {imgUrl: url}});
        if (isUpdated) {
            studentReact(id);
        }
        return isUpdated;
    },
    querySchStudentOptionUnPaid() {
        return [];
    }

});

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}


let studentReact = function (id) {
    let doc = Sch_StudentReact.findOne();
    if (doc) {
        Sch_StudentReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_StudentReact.insert({
            id: id
        });
    }
}