import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    posSaleReceivePaymentByCustomerDetailReport(params, translate) {
        let parameter = {};
        let parameterReceive = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;
            parameterReceive.rolesArea = params.area;

        }
        if (params.locationId != "") {
            parameter.locationId = params.locationId;
            parameterReceive.locationId = params.locationId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        parameter.invoiceDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };
        parameterReceive.receivePaymentDate = {
            $lte: moment(params.date[1]).endOf("day").toDate(),
            $gte: moment(params.date[0]).startOf("day").toDate()
        };

        let saleReceivePaymentlList;
        let saleReceivePaymentHTML = "";

        //Range Date
        saleReceivePaymentlList = Pos_Invoice.aggregate([

            {
                $match: parameter
            },
            {
                $sort: {
                    invoiceDate: 1
                }
            },
            {
                $group: {
                    _id: {
                        customerId: "$customerId"
                    },
                    data: {$push: "$$ROOT"},
                    total: {$sum: "$total"},
                    discountValue: {$sum: "$discountValue"},
                    netTotal: {$sum: "$netTotal"},
                }
            },
            {
                $lookup:
                    {
                        from: "pos_customer",
                        localField: "_id.customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
            },
            {
                $unwind: {
                    path: "$customerDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    total: {$sum: "$total"},
                    netTotal: {$sum: "$netTotal"},
                    discountValue: {$sum: "$discountValue"},
                }
            }
        ]);

        //Range Date
        let receivePaymentList = Pos_ReceivePayment.aggregate([

            {
                $match: parameterReceive
            },
            {
                $sort: {
                    receivePaymentDate: 1,
                    createdAt: 1,
                }
            },
            {
                $project: {
                    invoiceDate: "$receivePaymentDate",
                    netTotal: "$totalPaid",
                    desc: "$note",
                    rec: "Is Receive",
                    customerId: 1,
                    transactionType: "Receive Payment"
                }
            },
            {
                $group: {
                    _id: {
                        customerId: "$customerId"
                    },

                    data: {$push: "$$ROOT"}
                }
            },
            {
                $lookup:
                    {
                        from: "pos_customer",
                        localField: "_id.customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
            },
            {
                $unwind: {
                    path: "$customerDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
        let newDataArr = saleReceivePaymentlList.length > 0 ? saleReceivePaymentlList[0].data.concat(receivePaymentList) : receivePaymentList;
        let result = [];
        newDataArr.reduce(function (key, val) {
            if (!key[val._id.customerId]) {
                key[val._id.customerId] = {
                    data: val.data,
                    customerDoc: val.customerDoc
                };
                result.push(key[val._id.customerId]);
            } else {
                key[val._id.customerId].data = key[val._id.customerId].data.concat(val.data);
            }
            return key;
        }, {});

        if (result.length > 0) {
            let grandTotal = 0;
            result.forEach((obj) => {
                saleReceivePaymentHTML += `
                    <tr>
                            <th style="text-align: left !important;" colspan="7">${obj.customerDoc.name}</th>
                    </tr>
            
            `;

                let bal = 0;
                let ind = 1;

                let newDataSort = obj.data.sort(compareASD);
                newDataSort.forEach((ob) => {
                    if (ob.rec && ob.rec === "Is Receive") {
                        bal -= ob.netTotal;
                    } else {
                        bal += ob.netTotal;
                    }
                    saleReceivePaymentHTML += `
                           <tr>
                                                       <td style="text-align: center !important;">${ind}</td>

                                <td>${moment(ob.invoiceDate).format("DD/MM/YYYY")}</td>
                                <td>${ob.transactionType || ""}</td>
                                <td>${getVoucherSubString(ob.invoiceNo || "")}</td>
                                <td style="text-align: left !important;">${ob.desc || ""}</td>
                                <td>${formatCurrency(ob.netTotal, companyDoc.baseCurrency)}</td>
                                <td>${formatCurrency(bal, companyDoc.baseCurrency)}</td>     
                           </tr>
                    `;
                    ind++;

                })
                grandTotal += bal;
            })
            saleReceivePaymentHTML += `
            <tr>
                <th colspan="6">${translate['grandTotal']}</th>
                 <th>${formatCurrency(grandTotal, companyDoc.baseCurrency)}</th>
            </tr>
`
        }

        data.dateHeader = moment(params.date[0]).format("DD/MM/YYYY") + " - " + moment(params.date[1]).format("DD/MM/YYYY");
        data.currencyHeader = companyDoc.baseCurrency;

        data.saleReceivePaymentHTML = saleReceivePaymentHTML;
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


let compareASD = function (a, b) {
    if (a.invoiceDate.getTime() < b.invoiceDate.getTime()) {
        return -1;
    } else if (a.invoiceDate.getTime() > b.invoiceDate.getTime()) {
        return 1;
    } else {
        return 0;
    }
}


