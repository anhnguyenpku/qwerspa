import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Transcript} from '../../../imports/collection/schTranscript';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import {Sch_Major} from "../../../imports/collection/schMajor";
import {Sch_Subject} from "../../../imports/collection/schSubject";

Meteor.methods({
    schTranscriptReport(studentId, majorId, translate) {
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});
        //Range Date
        let transcriptList = Sch_Transcript.aggregate([
            {$match: {studentId: studentId, majorId: majorId}},
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            }, {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {newArr: {$concatArrays: ["$culumnSemester1", "$culumnSemester2"]}, studentDoc: 1}
            },
            {
                $unwind: {
                    path: "$newArr",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: {
                        year: "$newArr.year",
                        ind: "$newArr.ind"
                    },
                    data: {$push: "$newArr"},
                    studentDoc: {$last: "$studentDoc"}
                }
            },
            {
                $sort: {
                    "_id.ind": -1
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year"
                    },
                    data: {$addToSet: "$$ROOT"},
                    studentDoc: {$last: "$studentDoc"}
                }
            },
            {
                $sort: {
                    "_id.year": 1
                }
            }

        ]);
        let printTranscriptHtml = "";
        let subjectList = Sch_Subject.find().fetch();

        if (transcriptList.length > 0) {
            /*let newArr = transcriptList[0].culumnSemester1.concat(transcriptList[0].culumnSemester2 || []);
            newArr.sort(orderByProperty("ind", "sem"));*/
            // console.log(transcriptList);
            transcriptList.forEach((o) => {
                let countY = 0;
                let countFirstGPA = 0;
                console.log(o.data);
                let gpa1 = 0;
                let gpa2 = 0;
                let lengSem1 = 0;
                let lengSem2 = 0;
                o.data.forEach((obj) => {
                    if (obj) {
                        if (obj.data[0].grade !== "Un Range") {
                            obj.data.forEach((ob) => {
                                if (ob.grade !== "Un Range") {
                                    if (ob.sem === 1) {
                                        gpa1 += ob.gradePoint;
                                        lengSem1++;
                                    } else if (ob.sem === 2) {
                                        gpa2 += ob.gradePoint;
                                        lengSem2++;
                                    }
                                }
                            });
                        }
                    }
                });
                gpa1 = numeral(gpa1 / lengSem1).format("0,00.00");
                gpa2 = numeral(gpa2 / lengSem2).format("0,00.00");
                let rowSpanYear = lengSem1 >= lengSem2 ? lengSem1 : lengSem2;
                o.data.forEach((obj) => {
                        if (obj) {
                            if (obj.data[0].grade !== "Un Range") {
                                let lengthSeme = obj.data.length;

                                obj.data.forEach((ob) => {
                                    let subjectDoc = subjectList.find((elem) => {
                                        return elem._id === ob.subjectId;
                                    });
                                    ob.gradePoint = numeral(ob.gradePoint).format("0,00.00");
                                    if (countY === 0) {
                                        if (ob.sem === 1) {
                                            printTranscriptHtml += `
                                                <tr>
                                                    <td rowspan="${rowSpanYear}" style="vertical-align: inherit !important; text-align: center !important;">${obj._id.year}</td>
                                                    <td class="tran-forth">${subjectDoc.name}</td>
                                                    <td class="tran-first">${ob.credit || ""}</td>
                                                    <td class="tran-first">${ob.grade || ""}</td>
                                                    <td class="tran-first">${ob.gradePoint || ""}</td>
                                                    <td rowspan="${rowSpanYear}" class="tran-second" style="vertical-align: inherit !important; text-align: center !important;">${gpa1 || ""}</td>
                                                `;

                                            if (lengthSeme !== 2) {
                                                printTranscriptHtml += `
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                </tr>
                                                `;
                                            }
                                            countY++;
                                        } else if (ob.sem === 2) {
                                            if (lengthSeme !== 2) {
                                                printTranscriptHtml += `
                                                    <td rowspan="${rowSpanYear}" class="tran-second">${obj._id.year}</td>
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                    <td class="tran-first"></td>
                                                    <td  class="tran-first"></td>
                                                    <td rowspan="${rowSpanYear}" class="tran-second"></td>
                                                </tr>
                                                `;
                                                countY++;
                                            }
                                            printTranscriptHtml += `
                                                    <td  class="tran-forth">${ob.grade !== "Un Range" ? subjectDoc.name : ""}</td>
                                                    <td  class="tran-first">${ob.grade !== "Un Range" ? ob.credit || "" : ""}</td>
                                                    <td class="tran-first">${ob.grade !== "Un Range" ? ob.grade || "" : ""}</td>
                                                    <td class="tran-first">${ob.grade !== "Un Range" ? ob.gradePoint || "" : ""}</td>
                                                     <td rowspan="${rowSpanYear}" class="tran-second">${gpa2}</td>

                                                    </tr>
                                            `;
                                        }
                                    } else {
                                        if (ob.sem === 1) {
                                            printTranscriptHtml += `
                                           <tr>
                                                <td class="tran-forth">${subjectDoc.name}</td>
                                                <td class="tran-third">${ob.credit || ""}</td>
                                                <td  class="tran-third">${ob.grade || ""}</td>
                                                <td  class="tran-third">${ob.gradePoint || ""}</td>
                                       
                                            `;

                                            if (lengthSeme !== 2) {
                                                printTranscriptHtml += `
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                </tr>
                                                `;
                                            }
                                        } else {
                                            if (lengthSeme !== 2) {
                                                printTranscriptHtml += `
                                                <tr>
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                    <td  class="tran-third"></td>
                                                `;
                                            }
                                            if (countFirstGPA === 0) {
                                                printTranscriptHtml += `
                                            <td  class="tran-forth">${ob.grade !== "Un Range" ? subjectDoc.name : ""}</td>
                                            <td class="tran-first">${ob.grade !== "Un Range" ? ob.credit || "" : ""}</td>
                                            <td class="tran-first">${ob.grade !== "Un Range" ? ob.grade || "" : ""}</td>
                                            <td class="tran-first">${ob.grade !== "Un Range" ? ob.gradePoint || "" : ""}</td>
                                            <td rowspan="${rowSpanYear}" class="tran-second">${gpa2}</td>

                                        </tr>
                                        `;
                                                countFirstGPA++;

                                            } else {
                                                printTranscriptHtml += `
                                            <td class="tran-forth">${ob.grade !== "Un Range" ? subjectDoc.name : ""}</td>
                                            <td class="tran-third">${ob.grade !== "Un Range" ? ob.credit || "" : ""}</td>
                                            <td class="tran-third">${ob.grade !== "Un Range" ? ob.grade || "" : ""}</td>
                                            <td class="tran-third">${ob.grade !== "Un Range" ? ob.gradePoint || "" : ""}</td>
                                        </tr>
                                        `;
                                            }
                                        }
                                    }
                                })
                            }
                        }

                    }
                );
            })
            ;

            printTranscriptHtml += `
                <tr>
                    <td colspan="11" style="border-bottom: 0px !important;border-left: 0px !important;border-right: 0px !important;"></td>
                </tr>
            `;


            let majorDoc = Sch_Major.findOne({_id: majorId});
            let transcriptDoc = transcriptList[0];
            transcriptDoc.yearFrom = moment(transcriptDoc.studentDoc.yearFrom).add(1, "month").format("YYYY");
            transcriptDoc.yearTo = moment(transcriptDoc.studentDoc.yearTo).add(1, "month").format("YYYY");
            data.transcriptDoc = transcriptDoc;
            data.majorDoc = majorDoc;

        }

        data.printTranscriptHtml = printTranscriptHtml;
        return data;
    }
})
;

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}


function orderByProperty(prop) {
    let args = Array.prototype.slice.call(arguments, 1);
    return function (a, b) {
        let equality = a[prop] - b[prop];
        if (equality === 0 && arguments.length > 1) {
            return orderByProperty.apply(null, args)(a, b);
        }
        return equality;
    };
}

