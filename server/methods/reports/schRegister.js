import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Register} from '../../../imports/collection/schRegister';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schRegisterReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.programId != "") {
            parameter.programId = params.programId;
        }
        if (params.majorId != "") {
            parameter.majorId = params.majorId;
        }

        if (params.levelId != "") {
            parameter.levelId = params.levelId;
        }
        if (params.promotionId != "") {
            parameter.promotionId = params.promotionId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.registerDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };

        let registerHTML = "";

        let registerList = Sch_Register.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_level',
                    localField: 'levelId',
                    foreignField: '_id',
                    as: 'levelDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$levelDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_program',
                    localField: 'programId',
                    foreignField: '_id',
                    as: 'programDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$programDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_major',
                    localField: 'majorId',
                    foreignField: '_id',
                    as: 'majorDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$majorDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_promotion',
                    localField: 'promotionId',
                    foreignField: '_id',
                    as: 'promotionDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$promotionDoc",
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
        if (registerList[0] && registerList[0].data.length > 0) {
            registerList[0].data.forEach((obj) => {
                if (obj) {
                    registerHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.registerDateName}</td>
                            <td style="text-align: center !important;">${obj.programDoc.name}</td>
                            <td style="text-align: center !important;">${obj.majorDoc.name}</td>
                            <td style="text-align: center !important;">${obj.levelDoc.name}</td>
                            <td style="text-align: center !important;">${obj.promotionDoc.value} ${getTypePromotion(obj.promotionDoc.promotionType)}</td>
                            <td>${obj.levelDoc.price}</td>
                        </tr>
                    `;
                    i++;
                }
            });
            registerHTML += `
                    <tr>
                        <th colspan="7">${translate['grandTotal']}</th>
                        <td>${registerList[0].totalPrice}</td>
                    </tr>
            `;
        }

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.registerHTML = registerHTML;
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
