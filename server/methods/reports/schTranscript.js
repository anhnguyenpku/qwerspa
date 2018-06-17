import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Transcript} from '../../../imports/collection/schTranscript';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

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
            }
        ]);
        console.log(transcriptList);
        let printTranscriptHtml = "";
        let ind = 1;
        if (transcriptList.length > 0) {

        }
        data.transcriptDoc = transcriptList[0];
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
