import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js'
import {WB_Payment} from '../../../imports/collection/payment.js';
import {WB_Customer} from '../../../imports/collection/customer.js';
import {TransactionDetail} from '../../../imports/collection/transaction.js';
import {unfinishedPayment} from '../../../imports/collection/unfinshed-work.js';
import Aggr from '../../../imports/api/methods/aggregation';
import {WB_Block} from "../../../imports/collection/block";

Meteor.methods({
    getMeterJournalByBarcode(val) {
        if (Meteor.userId()) {

            let listPayment = [];
            let currentBarcodeIsExist = unfinishedPayment.findOne({barcode: val});
            if (currentBarcodeIsExist) {
                let user = Meteor.users.findOne({_id: currentBarcodeIsExist.createdBy});
                throw new Meteor.Error(`#${val} កំពុងប្រតិបត្តិការជាមួយអ្នកប្រើប្រាស់ ${user.username}`);
            }
            let meterJournal = WB_MeterReadingJournalDetail.aggregate([
                {$match: {$or: [{barcode: val},{sumBarcode: val}, {customerId: val}]}},
                {
                    $lookup: {
                        from: "wb_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
                // {
                //     $project: {
                //         "categoryDoc": 1,
                //         "customerDoc": 1,
                //         "classDoc": 1,
                //         "districtDoc": 1,
                //         "quartierDoc": 1,
                //         "blockDoc": 1,
                //         "meterTypeDoc":1,
                //         "streetNo": {$ifNull:["$streetNo", "$customerDoc.streetNo"]},
                //         "dpc": {$ifNull:["$dpc", "$customerDoc.dpc"]},
                //         "khName": '$customerDoc.khName',
                //         "_id": 1,
                //         "assignedUsers" : 1,
                //         "balance" : 1,
                //         "barcode" : 1,
                //         "billingCycle" :1,
                //         "block" : 1,
                //         "category" : 1,
                //         "closedAt" : 1,
                //         "contributionFee" :1,
                //         "contributionFeePrice" :1,
                //         "createdAt" : 1,
                //         "createdBy" : 1,
                //         "customerId" : 1,
                //         "district" : 1,
                //         "grandTotal" : 1,
                //         "hasOldMeterWaterConsumption" : 1,
                //         "isEstimated" : 1,
                //         "isExpired" : 1,
                //         "level" : 1,
                //         "maintenanceFee" :1,
                //         "maintenanceFeePrice" :1,
                //         "meterReadingJournalId" :1,
                //         "modifiedLevel" : 1,
                //         "modifyTime" : 1,
                //         "newReading" : 1,
                //         "newReadingDate" : 1,
                //         "oldBalance" :1,
                //         "paymentStatus" : 1,
                //         "position" : 1,
                //         "prevReading" : 1,
                //         "prevReadingDate" :1,
                //         "price" : 1,
                //         "priceList" : 1,
                //         "printed" : 1,
                //         "printedCount" :1,
                //         "quantity" : 1,
                //         "quartier" :1,
                //         "rolesArea" : 1,
                //         "saveWritten" : 1,
                //         "tariff" : 1,
                //         "total" : 1,
                //         "updatedAt" : 1,
                //         "updatedBy" :1,
                //         "waterConsumption" :1,
                //         "written" : 1
                //     }
                // },
                {
                    $lookup: {
                        from: 'wb_requestCuttingWater',
                        localField: 'requestCuttingWaterId',
                        foreignField: '_id',
                        as: 'requestCuttingWaterDoc'
                    }
                },
                {
                    $unwind: {path: '$requestCuttingWaterDoc', preserveNullAndEmptyArrays: true}
                }
            ]);
            /* let meterJournal = WB_MeterReadingJournalDetail.aggregate([
                {$match: {$or: [{barcode: val}, {customerId: val}]}},
                {
                    $lookup: {
                        from: "wb_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
               {
                    $lookup: {
                        from: "wb_tariff",
                        localField: "tariff",
                        foreignField: "_id",
                        as: "tariffDoc"
                    }
                },
                {$unwind: {path: '$tariffDoc', preserveNullAndEmptyArrays: true}},
               {
                    $lookup: {
                        from: "wb_saving",
                        localField: "customerId",
                        foreignField: "customerId",
                        as: "savingDoc"
                    }
                },
                {
                    $unwind: {path: '$savingDoc', preserveNullAndEmptyArrays: true}
                },

            ]); */
            if (meterJournal.length > 0) {
                //have to update hasha
                let user = Meteor.users.findOne(Meteor.userId());
                if (user.username == "cashier1") {
                    let block = WB_Block.findOne({_id: meterJournal[0].block});
                    let blockNumber = parseInt(block.code);
                    if ((blockNumber % 2) != 0) {
                        throw new Meteor.Error("Can Only Receive payment with Even Block");
                    }

                } else if (user.username == "cashier2") {
                    let block = WB_Block.findOne({_id: meterJournal[0].block});
                    let blockNumber = parseInt(block.code);
                    if ((blockNumber % 2) == 0) {
                        throw new Meteor.Error("Can Only Receive payment with Odd Block");
                    }
                }
                //hasha

                let transactions = lookupUnpaidInvoiceTransaction(
                    {
                        type: 'post',
                        status: 'active',
                        customerId: meterJournal[0].customerId,
                        _id: {$ne: meterJournal[0]._id}
                    }
                );
                transactions.forEach(function (transaction) {
                    listPayment.push(transaction.meterReadingJournalDetailDoc); //push unpaid invoice transaction to list payment
                });
                let existMeter = listPayment.find(o => o._id == meterJournal[0]._id);
                if (!existMeter) {
                    listPayment.push(meterJournal[0]);
                }
            }
            return listPayment.length > 0 ? listPayment : [];
        } else {
            throw new Meteor.Error("You must be login to get Invoice for Pay.");
        }
    },
    savePayment(payments) {
        if (Meteor.userId()) {
            try {
                payments.meterJournal.forEach(function (mj) {
                    let balance = mj.dueAmount - (mj.withdrawSaving + mj.paidAmount);
                    let status = balance == 0 ? 'closed' : 'partial';
                    let payment = {
                        date: payments.date,
                        dateFormatted: moment(payments.date).format("YYYY-MM-DD HH:mm:ss"),
                        meterJournalId: mj.meterJournalId,
                        description: payments.description,
                        dueAmount: mj.dueAmount,
                        paidAmount: mj.paidAmount,
                        withdrawSaving: mj.withdrawSaving,
                        balance: balance,
                        mainTellerId: '001',
                        type: mj.type,
                        tellerId: '002',
                        agentId: payments.agentId,
                        isAccept: false,
                        rolesArea: payments.rolesArea,
                        status: status,
                        createdBy: payments.createdBy,
                       // feeAmount:payments.feeAmount,
                       // penaltyAmount:payments.penaltyAmount
                    };
                    WB_Payment.insert(payment);
                });
                return true;
            } catch (err) {
                throw new Meteor.Error(err.message);
            }
        } else {
            throw new Meteor.Error("You must be login to Pay Invoice ");
        }
    },
    barcodeQueryString(queryString, rolesArea) {
        let query = new RegExp(queryString, 'i');
        let journalDetails = WB_MeterReadingJournalDetail.find({
            paymentStatus: {$ne: 'closed'},
            written: true,
            rolesArea: rolesArea,
            barcode: {$regex: query}
        }, {limit: 20});
        let list = [];
        journalDetails.forEach(function (journalDetail) {
            list.push({value: journalDetail.barcode});
        });
        return list;
    },
    queryCustomerAutoComplete({q, options = {limit: 10, skip: 0}, rolesArea}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                count: 0,
            }
            let selector = {rolesArea};
            let list = [];
            list.push({label: '(Please Choose)', value: ''});
            if (q && q != '') {
                let reg = new RegExp(q, 'i');
                selector.$or = [{newCustomerId: {$regex: reg}}, {dpc: {$regex: reg}}, {name: {$regex: reg}}, {khName: {$regex: reg}}]
            }
            let customers = WB_Customer.aggregate([
                {
                    $match: selector
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                },
                {
                    $sort: {dpc: 1}
                },
                {$sort: {name: 1}}
            ]);
            customers.forEach(function (customer) {
                list.push({
                    value: `DPC: ${customer.dpc} ${customer.khName}(${customer.name})`,
                    customerId: customer._id
                })
            });
            if (customers.length > 0) {
                data.content = list;
            }
            return data;
        }
    },
});

function lookupUnpaidInvoiceTransaction(selector) {
    return TransactionDetail.aggregate([
        {
            $match: selector
        },
        {
            $lookup: Aggr.lookup('wb_meterReadingJournalDetails', 'refId', '_id', 'meterReadingJournalDetailDoc')
        },
        {
            $unwind: Aggr.unwind('$meterReadingJournalDetailDoc')
        },
        {
            $lookup: Aggr.lookup('wb_customer', 'meterReadingJournalDetailDoc.customerId', '_id', 'meterReadingJournalDetailDoc.customerDoc')
        },
        {
            $lookup: Aggr.lookup('wb_saving', 'meterReadingJournalDetailDoc.customerId', 'customerId', 'meterReadingJournalDetailDoc.savingDoc')
        },
        {
            $lookup: Aggr.lookup('wb_requestCuttingWater', 'meterReadingJournalDetailDoc.requestCuttingWaterId', '_id', 'meterReadingJournalDetailDoc.requestCuttingWaterDoc')
        },
        {
            $unwind: Aggr.unwind('$meterReadingJournalDetailDoc.customerDoc')
        },
        {
            $unwind: Aggr.unwind('$meterReadingJournalDetailDoc.requestCuttingWaterDoc')
        },
        {
            $unwind: Aggr.unwind('$meterReadingJournalDetailDoc.savingDoc')
        }
    ]);
}