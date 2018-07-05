import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';
import {Pos_Bill} from '../../../imports/collection/posBill';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posUnPaidSummaryReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.billDate = {
            $lte: moment(params.date).endOf("day").toDate(),
        };

        parameter.$or = [
            {
                closeDate: {
                    $exists: false
                }
            },
            {
                status: {$ne: "Complete"}
            },
            {
                closeDate: {
                    $gt: moment(params.date).endOf("day").toDate()
                }
            }
        ];
        let parameter2 = {};
        parameter2.$or = [
            {
                "payBillDoc.payBillDate": {
                    $exists: false
                }
            },
            {
                "payBillDoc.payBillDate": {
                    $lt: moment(params.date).endOf("day").toDate()
                }
            }


        ];

        let unPaidList = Pos_Bill.aggregate([
            {
                $match: parameter
            },
            {
                $sort: {
                    billDate: 1,
                    createdAt: 1
                }
            },
            {
                $project: {
                    vendorId: 1,
                    total: 1,
                    discountValue: 1,
                    paid: 1
                }
            },
            {
                $group: {
                    _id: {
                        vendorId: "$vendorId"

                    },
                    billTotal: {$sum: "$total"},
                    billDiscount: {$sum: "$discountValue"},
                    billPaid: {$sum: "$paid"},
                }
            },
            {
                $lookup: {
                    from: 'pos_payBill',
                    localField: '_id.vendorId',
                    foreignField: 'vendorId',
                    as: 'payBillDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$payBillDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: parameter2
            },
            {
                $sort: {
                    "payBillDoc.payBillDate": 1,
                    "payBillDoc.createdAt": 1
                }
            },
            {
                $group: {
                    _id: {
                        vendorId: "$_id.vendorId"
                    },
                    billTotal: {$last: "$billTotal"},
                    billDiscount: {$last: "$billDiscount"},
                    billPaid: {$last: "$billPaid"},
                    payBillDoc: {$last: "$payBillDoc"}
                }
            },

            {
                $lookup:
                    {
                        from: "pos_vendor",
                        localField: "_id.vendorId",
                        foreignField: "_id",
                        as: "vendorDoc"
                    }
            },
            {
                $unwind: {
                    path: "$vendorDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "vendorDoc.name": 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    total: {$sum: "$billTotal"}
                }
            }
        ]);


        data.dateHeader = moment(params.date).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;
        let unPaidHTML = "";
        let grandTotal = 0;
        let grandDiscount = 0;
        let grandUnpaid = 0;
        let grandPaid = 0;
        let ind = 1;
        if (unPaidList.length > 0) {
            unPaidList[0].data.forEach((obj) => {

                if ((obj.payBillDoc && obj.payBillDoc.balanceUnPaid) || obj.billTotal - obj.billDiscount - obj.billPaid > 0) {
                    unPaidHTML += `
                    <tr>
                            <td style="text-align: left !important;">${ind}</td>
                            <td style="text-align: left !important;">${obj.vendorDoc.name}</td>
                            <td style="text-align: left !important;">${obj.vendorDoc.phoneNumber || ""}</td>
                            <td>${formatCurrency(obj.billTotal, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(obj.billDiscount + (obj.payBillDoc && obj.payBillDoc.totalDiscount) || 0, companyDoc.baseCurrency)}</td>
                            <td>${formatCurrency(obj.billTotal - (obj.billDiscount + (obj.payBillDoc && obj.payBillDoc.totalDiscount) || 0) - ((obj.payBillDoc && obj.payBillDoc.balanceUnPaid) || obj.billTotal - obj.billDiscount - obj.billPaid), companyDoc.baseCurrency)}</td>

                            <td>${formatCurrency((obj.payBillDoc && obj.payBillDoc.balanceUnPaid) || obj.billTotal - obj.billDiscount - obj.billPaid, companyDoc.baseCurrency)}</td>
                    </tr>
            
                 `
                    grandTotal += obj.billTotal;
                    grandPaid += obj.billTotal - (obj.billDiscount + (obj.payBillDoc && obj.payBillDoc.totalDiscount) || 0) - ((obj.payBillDoc && obj.payBillDoc.balanceUnPaid) || obj.billTotal - obj.billDiscount - obj.billPaid);
                    grandDiscount += obj.billDiscount + (obj.payBillDoc && obj.payBillDoc.totalDiscount) || 0;
                    grandUnpaid += (obj.payBillDoc && obj.payBillDoc.balanceUnPaid) || obj.billTotal - obj.billDiscount - obj.billPaid;
                    ind++;
                }
            })

            unPaidHTML += `
            <tr>
                <th colspan="3">${translate['grandTotal']}</th>
                 <td>${formatCurrency(grandTotal, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandDiscount, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandPaid, companyDoc.baseCurrency)}</td>
                 <td>${formatCurrency(grandUnpaid, companyDoc.baseCurrency)}</td>
            </tr>
`
        }
        data.unPaidHTML = unPaidHTML;
        return data;
    }
})
;

