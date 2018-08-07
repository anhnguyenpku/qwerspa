import {Pos_Bill} from '../../../imports/collection/posBill';
import {Pos_Invoice} from '../../../imports/collection/posInvoice';
import {Pos_TransferInventory} from '../../../imports/collection/posTransferInventory';
import {Pos_PayBill} from '../../../imports/collection/posPayBill';
import {Pos_Vendor} from '../../../imports/collection/posVendor';
import {Pos_Customer} from '../../../imports/collection/posCustomer';
import {Pos_AverageInventory} from '../../../imports/collection/posAverageInventory';

import {SpaceChar} from "../../../both/config.js/space"
import {formatCurrency, getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import {Pos_Product} from "../../../imports/collection/posProduct";
import {Pos_Location} from "../../../imports/collection/posLocation";
import numeral from "numeral";

Meteor.methods({
    addPosAverageInventory(data) {

        if (data.transactionType === "Bill") {
            data.item.forEach((doc) => {
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});
                let vendorDoc = Pos_Vendor.findOne({_id: data.vendorId});
                obj = {
                    cusVendId: data.vendorId,
                    cusVendName: vendorDoc && vendorDoc.name || "",
                    transactionId: data.id,
                    locationId: data.locationId,
                    averageInventoryDate: data.billDate,
                    averageInventoryDateName: data.billDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.cost,
                    amount: doc.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) + doc.amount,
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty,
                    averageCost: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty == 0 ? 0 : ((onHandInventory && onHandInventory.amountEnding || 0) + doc.amount) / ((onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty),
                    transactionType: "Bill",
                    rolesArea: data.rolesArea
                };

                Pos_AverageInventory.insert(obj);

            })
        } else if (data.transactionType === "Invoice") {

            data.item.forEach((doc) => {
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});

                let customerDoc = Pos_Customer.findOne({_id: data.customerId});

                obj = {
                    cusVendId: data.customerId,
                    cusVendName: customerDoc && customerDoc.name || "",

                    transactionId: data.id,
                    locationId: data.locationId,
                    averageInventoryDate: data.invoiceDate,
                    averageInventoryDateName: data.invoiceDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.price,
                    amount: doc.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) - ((onHandInventory && onHandInventory.averageCost || 0) * doc.qty),
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) - doc.qty,
                    averageCost: onHandInventory && onHandInventory.averageCost || 0,
                    transactionType: "Invoice",
                    rolesArea: data.rolesArea,
                    profit: doc.amount - ((onHandInventory && onHandInventory.averageCost || 0) * doc.qty)
                };

                let isInsrt = Pos_AverageInventory.insert(obj);
                if (isInsrt) {
                    Pos_Invoice.direct.update({
                        _id: data.id,
                        "item.itemId": doc.itemId
                    }, {
                        $set: {
                            "item.$.cost": onHandInventory && onHandInventory.averageCost || 0,
                            "item.$.totalCost": (onHandInventory && onHandInventory.averageCost || 0) * doc.qty
                        }
                    });
                }
            })
        } else if (data.transactionType === "Transfer Inventory") {
            data.item.forEach((doc) => {
                //Reduce From Location
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationFromId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});

                let locationToDoc = Pos_Location.findOne({_id: data.locationToId});
                doc.amount = numeral(doc.amount).value();
                obj = {
                    cusVendId: data.locationToId,
                    cusVendName: locationToDoc && locationToDoc.name || "",

                    transactionId: data.id,
                    locationId: data.locationFromId,
                    averageInventoryDate: data.transferInventoryDate,
                    averageInventoryDateName: data.transferInventoryDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.cost,
                    amount: doc.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) - ((onHandInventory && onHandInventory.averageCost || 0) * doc.qty),
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) - doc.qty,
                    averageCost: onHandInventory && onHandInventory.averageCost || 0,
                    transactionType: "Transfer From",
                    rolesArea: data.rolesArea,
                    profit: doc.amount - ((onHandInventory && onHandInventory.averageCost || 0) * doc.qty)
                };

                let isInsrt = Pos_AverageInventory.insert(obj);

                //Add To Location
                let objTo = {};
                let onHandInventoryTo = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationToId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});

                let locationFromDoc = Pos_Location.findOne({_id: data.locationFromId});

                objTo = {
                    cusVendId: data.locationFromId,
                    cusVendName: locationFromDoc && locationFromDoc.name || "",

                    transactionId: data.id,
                    locationId: data.locationToId,
                    averageInventoryDate: data.transferInventoryDate,
                    averageInventoryDateName: data.transferInventoryDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.cost,
                    amount: doc.amount,
                    amountEnding: (onHandInventoryTo && onHandInventoryTo.amountEnding || 0) + (doc.cost * doc.qty),
                    qtyEnding: (onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) + doc.qty,
                    averageCost: (onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) + doc.qty == 0 ? 0 : ((onHandInventoryTo && onHandInventoryTo.amountEnding || 0) + doc.amount) / ((onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) + doc.qty),
                    transactionType: "Transfer To",
                    rolesArea: data.rolesArea
                };

                let isInsrtTo = Pos_AverageInventory.insert(objTo);
            })
        }


    },
    reducePosAverageInventory(data) {
        if (data.transactionType === "Remove Bill") {
            data.item.forEach((doc) => {
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});
                let vendorDoc = Pos_Vendor.findOne({_id: onHandInventory.cusVendId});

                obj = {
                    cusVendId: onHandInventory.cusVendId,
                    cusVendName: vendorDoc && vendorDoc.name || "",
                    transactionId: onHandInventory._id,
                    locationId: onHandInventory.locationId,
                    averageInventoryDate: onHandInventory.averageInventoryDate,
                    averageInventoryDateName: onHandInventory.averageInventoryDateName,
                    itemId: doc.itemId,
                    qty: onHandInventory.qty,
                    price: onHandInventory.price,
                    amount: onHandInventory.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) - doc.amount,
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) - doc.qty,
                    averageCost: (onHandInventory && onHandInventory.qtyEnding || 0) - doc.qty == 0 ? 0 : ((onHandInventory && onHandInventory.amountEnding || 0) - doc.amount) / ((onHandInventory && onHandInventory.qtyEnding || 0) - doc.qty),
                    transactionType: "Remove Bill",
                    rolesArea: data.rolesArea
                };

                Pos_AverageInventory.insert(obj);
            })
        } else if (data.transactionType === "Remove Invoice") {
            data.item.forEach((doc) => {
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});
                let customerDoc = Pos_Customer.findOne({_id: onHandInventory.cusVendId});
                obj = {
                    cusVendId: onHandInventory.cusVendId,
                    cusVendName: customerDoc && customerDoc.name || "",

                    transactionId: onHandInventory._id,
                    locationId: onHandInventory.locationId,
                    averageInventoryDate: onHandInventory.averageInventoryDate,
                    averageInventoryDateName: onHandInventory.averageInventoryDateName,
                    itemId: doc.itemId,
                    qty: onHandInventory.qty,
                    price: onHandInventory.price,
                    amount: onHandInventory.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) + doc.totalCost,
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty,
                    averageCost: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty == 0 ? 0 : ((onHandInventory && onHandInventory.amountEnding || 0) + doc.totalCost) / ((onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty),
                    transactionType: "Remove Invoice",
                    rolesArea: data.rolesArea
                };

                Pos_AverageInventory.insert(obj);
            })
        } else if (data.transactionType === "Remove Transfer Inventory") {
            data.item.forEach((doc) => {
                //Reduce From Location
                let objTo = {};
                let onHandInventoryTo = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationToId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});

                let locationFromDoc = Pos_Location.findOne({_id: data.locationFromId});
                doc.amount = numeral(doc.amount).value();

                objTo = {
                    cusVendId: data.locationFromId,
                    cusVendName: locationFromDoc && locationFromDoc.name || "",

                    transactionId: onHandInventoryTo._id,
                    locationId: data.locationToId,
                    averageInventoryDate: data.transferInventoryDate,
                    averageInventoryDateName: data.transferInventoryDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.cost,
                    amount: doc.amount,
                    amountEnding: (onHandInventoryTo && onHandInventoryTo.amountEnding || 0) - (doc.cost * doc.qty),
                    qtyEnding: (onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) - doc.qty,
                    averageCost: (onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) - doc.qty == 0 ? 0 : ((onHandInventoryTo && onHandInventoryTo.amountEnding || 0) - doc.amount) / ((onHandInventoryTo && onHandInventoryTo.qtyEnding || 0) - doc.qty),
                    transactionType: "Remove Transfer To",
                    rolesArea: data.rolesArea
                };

                let isInsrtTo = Pos_AverageInventory.insert(objTo);

                //Add To Location
                let obj = {};
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationFromId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});

                let locationToDoc = Pos_Location.findOne({_id: data.locationToId});

                obj = {
                    cusVendId: data.locationToId,
                    cusVendName: locationToDoc && locationToDoc.name || "",

                    transactionId: onHandInventory._id,
                    locationId: data.locationFromId,
                    averageInventoryDate: data.transferInventoryDate,
                    averageInventoryDateName: data.transferInventoryDateName,
                    itemId: doc.itemId,
                    qty: doc.qty,
                    price: doc.cost,
                    amount: doc.amount,
                    amountEnding: (onHandInventory && onHandInventory.amountEnding || 0) + (doc.cost * doc.qty),
                    qtyEnding: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty,
                    averageCost: (onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty == 0 ? 0 : ((onHandInventory && onHandInventory.amountEnding || 0) + doc.amount) / ((onHandInventory && onHandInventory.qtyEnding || 0) + doc.qty),
                    transactionType: "Remove Transfer From",
                    rolesArea: data.rolesArea
                };

                let isInsrt = Pos_AverageInventory.insert(obj);


            })
        }
    },
    queryPosAverageCostById(id, rolesArea, locationId) {
        let data = Pos_AverageInventory.findOne({
            itemId: id,
            rolesArea: rolesArea,
            locationId: locationId,
        }, {sort: {createdAt: -1}});
        if (data) {
            let productDoc = Pos_Product.findOne({_id: id}, {name: 1, code: 1})
            data.name = productDoc && productDoc.name || "";
            data.code = productDoc && productDoc.code || "";
            data.itemId = productDoc && productDoc._id || "";
        }
        return data && data.qtyEnding > 0 ? data : false;
    },

    checkStockBalance(data, isUpdate, dataBeforeUpdate) {
        if (data.item.length > 0) {
            let i = 0;
            data.item.forEach((doc) => {
                let onHandInventory = Pos_AverageInventory.findOne({
                    itemId: doc.itemId,
                    locationId: data.locationId,
                    rolesArea: data.rolesArea
                }, {sort: {createdAt: -1}});
                if (isUpdate === true) {
                    let oldDoc = dataBeforeUpdate.item.find(function (element) {
                        return element.itemId === doc.itemId;
                    });
                    if (onHandInventory === undefined || onHandInventory && onHandInventory.qtyEnding < doc.qty - oldDoc.qty) {
                        i++;
                    }
                } else {
                    if (onHandInventory === undefined || onHandInventory && onHandInventory.qtyEnding < doc.qty) {
                        i++;
                    }
                }
            });
            return i;
        }
    },
    fixStock() {
        let billList = Pos_Bill.find().fetch();
        billList.forEach((data) => {
            data.id = data._id;
            data.transactionType = "Bill";
            Meteor.call("addPosAverageInventory", data, (err, result) => {
                if (err) {
                    console.log(err.message);
                    console.log(data);
                }
            })
        });
        console.log("Finish Bill");


        let transferList = Pos_TransferInventory.find().fetch();

        transferList.forEach((data) => {
            data.id = data._id;
            data.transactionType = "Transfer Inventory";
            Meteor.call("addPosAverageInventory", data, (err, result) => {
                if (err) {
                    console.log(err.message);
                    console.log(data);
                }
            })
        });
        console.log("Finish Transfer");


        let invoiceList = Pos_Invoice.find().fetch();
        invoiceList.forEach((data) => {
            data.id = data._id;
            data.transactionType = "Invoice";


            Meteor.call("addPosAverageInventory", data, (err, result) => {
                if (err) {
                    console.log(err.message);
                    console.log(data);

                }
            })
        });
        console.log("Finish Invoice");
    }
});


function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}