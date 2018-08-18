import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_BusRegister} from '../../../imports/collection/schBusRegister';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schBusRegisterActiveReport(params, translate) {
        let parameter = {};

        if (params.area !== "") {
            parameter.rolesArea = params.area;

        }
        if (params.busId !== "") {
            parameter.busId = params.busId;
        }
        if (params.busStopId !== "") {
            parameter.busStopId = params.busStopId;
        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.busRegisterDate = {
            $lte: moment(params.date).endOf("day").toDate()
        };

        let busRegisterActiveHTML = "";
        parameter.status = "Active";

        let busRegisterActiveList = Sch_BusRegister.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_bus',
                    localField: 'busId',
                    foreignField: '_id',
                    as: 'busDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$busDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_busStop',
                    localField: 'busStopId',
                    foreignField: '_id',
                    as: 'busStopDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$busStopDoc",
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
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    totalPrice: {$sum: "$price"}
                }
            },
        ]);


        let i = 1;
        if (busRegisterActiveList[0] && busRegisterActiveList[0].data.length > 0) {
            busRegisterActiveList[0].data.forEach((obj) => {
                if (obj) {
                    busRegisterActiveHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${obj.studentDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.busRegisterDateName}</td>
                            <td style="text-align: center !important;">${obj.busDoc.name}</td>
                            <td style="text-align: center !important;">${obj.busStopDoc.name}</td>
                            <td>${formatCurrency(obj.price)}</td>

                        </tr>
                    `;
                    i++;
                }
            });
            busRegisterActiveHTML += `
                    <tr>
                        <th colspan="5">${translate['grandTotal']}</th>
                        <td>${formatCurrency(busRegisterActiveList[0].totalPrice)}</td>
                    </tr>
            `;
        }

        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.busRegisterActiveHTML = busRegisterActiveHTML;
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
