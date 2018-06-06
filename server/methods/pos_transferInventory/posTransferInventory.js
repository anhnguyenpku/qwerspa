import {Pos_TransferInventory} from '../../../imports/collection/posTransferInventory';
import {Pos_Location} from '../../../imports/collection/posLocation';

import {SpaceChar} from "../../../both/config.js/space"
import {formatCurrency, getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";
import {WB_waterBillingSetup} from "../../../imports/collection/waterBillingSetup";
import numeral from 'numeral';

Meteor.methods({
    queryTransferInventory({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countTransferInventory: 0,
            };
            let companyDoc = WB_waterBillingSetup.findOne({});

            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{
                        transferInventoryDateName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {"locationToDoc.name": {$regex: reg, $options: 'mi'}}, {
                        "locationFromDoc.name": {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }];
                }
            }
            let posTransferInventory = Pos_TransferInventory.aggregate([
                {
                    $lookup: {
                        from: "pos_location",
                        localField: "locationFromId",
                        foreignField: "_id",
                        as: "locationFromDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$locationFromDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "pos_location",
                        localField: "locationToId",
                        foreignField: "_id",
                        as: "locationToDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$locationToDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: selector
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]).map((obj) => {
                obj.total = formatCurrency(obj.total, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
                return obj;
            });
            if (posTransferInventory.length > 0) {
                data.content = posTransferInventory;
                let posTransferInventoryTotal = Pos_TransferInventory.find(selector).count();
                data.countTransferInventory = posTransferInventoryTotal;
            }
            return data;
        }
    },
    queryTransferInventoryById(id) {
        let data = Pos_TransferInventory.findOne({_id: id});
        data.item.forEach((obj) => {
            obj.cost = formatCurrency(obj.cost);
            obj.amount = formatCurrency(obj.amount);
        })
        return data;
    },
    queryTransferInventoryByIdShow(id) {
        let data = Pos_TransferInventory.findOne({_id: id});
        let locationFrom = Pos_Location.findOne({_id: data.locationFromId});
        let locationTo = Pos_Location.findOne({_id: data.locationToId});
        let companyDoc = WB_waterBillingSetup.findOne({});
        data.total = formatCurrency(data.total, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
        data.item.map(function (obj) {
            obj.cost = formatCurrency(obj.cost, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
            obj.amount = formatCurrency(obj.amount, companyDoc.baseCurrency) + getCurrencySymbolById(companyDoc.baseCurrency);
            return obj;
        })
        data.locationFrom = locationFrom.name;
        data.locationTo = locationTo.name;
        return data;
    },
    insertTransferInventory(data) {
        data.transactionType = "Transfer Inventory";
        data.item.forEach(function (obj) {
            obj.amount = numeral(obj.amount).value();
            obj.cost = numeral(obj.cost).value();
            return obj;
        })
        let id = Pos_TransferInventory.insert(data);

        if (id) {
            data.id = id;
            data.transactionType = "Transfer Inventory";
            Meteor.call("addPosAverageInventory", data, (err, result) => {
                if (err) {
                    console.log(err.message);
                }
            })
        }

        return id;
    },
    updateTransferInventory(data, _id) {
        let dataBeforeUpdate = Pos_TransferInventory.findOne({_id: _id});
        data.item.forEach(function (obj) {
            obj.amount = numeral(obj.amount).value();
            obj.cost = numeral(obj.cost).value();
            return obj;
        })

        let isUpdated = Pos_TransferInventory.update({_id: _id},
            {
                $set: data
            });

        if (isUpdated) {
            Meteor.defer(function () {
                dataBeforeUpdate.transactionType = "Remove Transfer Inventory";
                Meteor.call("reducePosAverageInventory", dataBeforeUpdate, (err1, result1) => {
                    if (!err1) {
                        data.transactionType = "Transfer Inventory";
                        data.id = _id;
                        Meteor.call("addPosAverageInventory", data, (err2, result2) => {
                            if (err2) {
                                console.log(err2.message);
                            }
                        })
                    } else {
                        console.log(err1.message);
                    }

                })
            });
        }


        return isUpdated;
    },
    removeTransferInventory(id, data) {
        let isRemoved = Pos_TransferInventory.remove({_id: id});

        if (isRemoved) {
            data.transactionType = "Remove Transfer Inventory";
            Meteor.call("reducePosAverageInventory", data, (err, reuslt) => {
                if (err) {
                    console.log(err.message);
                }
            })
        }
        return isRemoved;
    }
});


function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}