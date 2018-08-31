import {Acc_FixedAsset} from "../../imports/collection/accFixedAsset";
import {WB_waterBillingSetup} from "../../imports/collection/waterBillingSetup";
import numeral from "numeral";
import math from "mathjs";

Meteor.methods({
    queryAccFixedAsset({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countAccFixedAsset: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{"accountDoc.name": {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {
                        description: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {life: {$regex: reg, $options: 'mi'}},
                        {value: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcFixedAssets = Acc_FixedAsset.aggregate([
                {
                    $lookup: {
                        from: "acc_chartAccount",
                        localField: "account",
                        foreignField: "_id",
                        as: "accountDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$accountDoc",
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
            ]);
            if (shcFixedAssets.length > 0) {
                let shcFixedAssetTotal = Acc_FixedAsset.find(selector).count();
                data.countAccFixedAsset = shcFixedAssetTotal;
                data.shcFixedAssets = shcFixedAssets;
            }
            return data;
        }
    },

    queryAccFixedAssetById(id) {
        let data = Acc_FixedAsset.findOne({_id: id});
        return data;
    },
    insertAccFixedAsset(data) {

        let transaction = generateScheduleFixedAsset(data);
        data.transaction = transaction;
        let doc = Acc_FixedAsset.insert(data);
        return doc;
    },
    updateAccFixedAsset(data) {
        let transaction = generateScheduleFixedAsset(data);
        data.transaction = transaction;
        let doc = Acc_FixedAsset.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeAccFixedAsset(id) {
        return Acc_FixedAsset.remove({_id: id});
    }
});


function generateScheduleFixedAsset(doc) {
    let transaction = [];
    let curMonth = moment(doc.buyDate).format("MM");
    let depPerYear = (doc.value - doc.estSalvage) / doc.life;

    let companyDoc = WB_waterBillingSetup.findOne();
    if (companyDoc.depreciationType === "001") {
        if (curMonth != "12") {
            for (let i = 1; i <= doc.life + 1; i++) {
                if (i == 1 || i == doc.life + 1) {
                    let maxMonth = i == 1 ? 12 - parseInt(curMonth) : parseInt(curMonth);
                    transaction.push({
                        year: i,
                        perMonth: math.round((depPerYear / 12), 2),
                        perYear: math.round((depPerYear / 12) * maxMonth, 2),
                        month: 0,
                        maxMonth: maxMonth,
                        status: false
                    })
                } else {
                    transaction.push({
                        year: i,
                        perMonth: math.round((depPerYear / 12), 2),
                        perYear: depPerYear,
                        month: 0,
                        maxMonth: 12,
                        status: false
                    })
                }
            }
        } else {
            for (let i = 1; i <= doc.life; i++) {
                transaction.push({
                    year: i,
                    perMonth: math.round((depPerYear / 12), 2),
                    perYear: depPerYear,
                    month: 0,
                    maxMonth: 12,
                    status: false
                })
            }
        }
    }


    return transaction;
}