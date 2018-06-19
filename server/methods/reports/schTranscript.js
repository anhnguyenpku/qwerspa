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

        ]);
        let printTranscriptHtml = "";
        let ind = 1;
        let year;
        let subjectList = Sch_Subject.find().fetch();


        if (transcriptList.length > 0) {
            /*let newArr = transcriptList[0].culumnSemester1.concat(transcriptList[0].culumnSemester2 || []);
            newArr.sort(orderByProperty("ind", "sem"));*/
            for (let i = 1; i <= 4; i++) {

                let printTranscriptHtmlGradePoint1 = "";
                let printTranscriptHtmlSubject1 = "";
                let printTranscriptHtmlCredit1 = "";
                let printTranscriptHtmlGrade1 = "";

                let printTranscriptHtmlGradePoint2 = "";
                let printTranscriptHtmlSubject2 = "";
                let printTranscriptHtmlCredit2 = "";
                let printTranscriptHtmlGrade2 = "";

                let ind1 = 1;
                let ind2 = 1;
                printTranscriptHtml += `
                        <tr>
                            <td colspan="4">
                            <table>
                                
                `;

                transcriptList[0].culumnSemester1.forEach((obj) => {
                    if (obj.year === i && obj.grade !== "Un Range") {
                        let subjectDoc = subjectList.find((elem) => {
                            return elem._id === obj.subjectId;
                        });


                        /*printTranscriptHtmlSubject1 += `${subjectDoc.name}<br>`;
                        printTranscriptHtmlCredit1 += `${obj.credit}<br>`;
                        printTranscriptHtmlGrade1 += `${obj.grade}<br>`;
                        printTranscriptHtmlGradePoint1 += `${obj.gradePoint || ""}<br>`;*/
                        printTranscriptHtml += `
                            <tr>
                                <td>${subjectDoc.name}</td>
                                <td>${subjectDoc.name}</td>
                                <td>${subjectDoc.name}</td>
                                <td>${subjectDoc.name}</td>
                            </tr>
                            </td>
                        `;

                        ind1++;
                    }
                });

                printTranscriptHtml += `
                            </table>
                        </tr>`;


                transcriptList[0].culumnSemester2.forEach((obj) => {
                    if (obj.year === i && obj.grade !== "Un Range") {
                        let subjectDoc = subjectList.find((elem) => {
                            return elem._id === obj.subjectId;
                        });
                        printTranscriptHtmlSubject2 += `${subjectDoc.name}<br>`;
                        printTranscriptHtmlCredit2 += `${obj.credit}<br>`;
                        printTranscriptHtmlGrade2 += `${obj.grade}<br>`;
                        printTranscriptHtmlGradePoint2 += `${obj.gradePoint2 || ""}<br>`;


                        ind2++;
                    }
                });

                if (ind1 > 1 || ind2 > 1) {
                    printTranscriptHtml += `
                      <tr>
                            <td style="text-align: center !important; vertical-align: inherit !important;">${i}</td>  
                `;
                    printTranscriptHtml += `
                            <td>${printTranscriptHtmlSubject1}</td>
                            <td>${printTranscriptHtmlCredit1}</td>
                            <td>${printTranscriptHtmlGrade1}</td>
                            <td>${printTranscriptHtmlGradePoint1}</td>

                            <td>${printTranscriptHtmlSubject2}</td>
                            <td>${printTranscriptHtmlCredit2}</td>
                            <td>${printTranscriptHtmlGrade2}</td>
                            <td>${printTranscriptHtmlGradePoint2}</td>

                           
                            </tr>
                `;
                }
            }


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
});

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

