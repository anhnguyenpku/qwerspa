import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_TeacherActivity} from '../../../imports/collection/schTeacherActivity';
import {Sch_Teacher} from '../../../imports/collection/schTeacher';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schTeacherActivityReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.teacherId != "") {
            parameter.teacherId = params.teacherId;
        }
        if (params.activityId != "") {
            parameter.activityId = params.activityId;
        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});

        if (params.date !== null && params.date !== "" && params.date !== undefined) {
            parameter.$or = [
                {
                    startDate: {
                        $lte: moment(params.date[1]).endOf("day").toDate(),
                        $gte: moment(params.date[0]).endOf("day").toDate(),
                    }
                }, {

                    endDate: {
                        $lte: moment(params.date[1]).endOf("day").toDate(),
                        $gte: moment(params.date[0]).startOf("day").toDate()
                    }
                }, {
                    $and: [{
                        startDate: {
                            $lte: moment(params.date[0]).endOf("day").toDate(),
                        },
                        endDate: {
                            $gte: moment(params.date[1]).startOf("day").toDate()
                        },
                    }
                    ]


                }
            ]
        }

        let teacherActivityHTML = "";

        let teacherActivityList = Sch_TeacherActivity.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_activity',
                    localField: 'activityId',
                    foreignField: '_id',
                    as: 'activityDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$activityDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_teacher',
                    localField: 'teacherId',
                    foreignField: '_id',
                    as: 'teacherDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$teacherDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    totalPrice: {$sum: "$levelDoc.price"}
                }
            },
        ]);


        let i = 1;
        if (teacherActivityList[0] && teacherActivityList[0].data.length > 0) {
            teacherActivityList[0].data.forEach((obj) => {
                if (obj) {
                    teacherActivityHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.teacherDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.startDateName}</td>
                            <td style="text-align: center !important;">${obj.endDateName}</td>
                            <td style="text-align: center !important;">${obj.activityDoc.name}</td>
                            <td style="text-align: center !important;">${obj.desc}</td>

                        </tr>
                    `;
                    i++;
                }
            });
        }

        if (params.date !== null && params.date !== "" && params.date !== undefined) {
            data.dateHeader = moment(params.date && params.date[0] || "").format("DD/MM/YYYY") + " - " + moment(params.date && params.date[1] || "").format("DD/MM/YYYY");
        } else {
            data.dateHeader = "";
        }
        data.teacherActivityHTML = teacherActivityHTML;
        return data;
    }
})
;


function getVoucherSubString(invoiceNo) {
    let newInvoice = invoiceNo.length > 9 ? parseInt((invoiceNo || "0000000000000").substr(9, 13)) : parseInt(invoiceNo || "0");
    return pad(newInvoice, 6);
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function getTypePromotion(val) {
    if (val === "Percent") {
        return "%";
    }
    return "";
}
