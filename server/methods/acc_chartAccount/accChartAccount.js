import {Acc_ChartAccount} from '../../../imports/collection/accChartAccount';
import {Acc_AccountType} from '../../../imports/collection/accAccountType';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryChartAccount({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countChartAccount: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {
                        code: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {description: {$regex: reg, $options: 'mi'}}];
                }
            }
            let chartAccounts = Acc_ChartAccount.aggregate([
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
                },
                {
                    $lookup: {
                        from: "acc_accountType",
                        localField: "accountTypeId",
                        foreignField: "_id",
                        as: "accountTypeDoc"
                    }
                },
                {
                    $unwind: {path: "$accountTypeDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $lookup: {
                        from: "acc_chartAccount",
                        localField: "subAccountOf",
                        foreignField: "_id",
                        as: "subAccountOfDoc"
                    }
                },
                {
                    $unwind: {path: "$subAccountOfDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        code: 1,
                        subAccountOf: 1,
                        accountTypeId: 1,
                        accountTypeName: "$accountTypeDoc.name",
                        level: 1,
                        description: 1,
                        isPaidTax: 1,
                        isPayment: 1,
                        mapToAccount: 1,
                        mapFixedAsset: 1,
                        subAccountOfName: {$concat: ["$subAccountOfDoc.code", " : ", "$subAccountOfDoc.name"]}
                    }
                }
            ]);
            if (chartAccounts.length > 0) {
                data.content = chartAccounts;
                let chartAccountTotal = Acc_ChartAccount.find(selector).count();
                data.countChartAccount = chartAccountTotal;
            }
            return data;
        }
    },
    queryChartAccountById(id) {
        let data = Acc_ChartAccount.findOne({_id: id});
        return data;
    },
    insertChartAccount(data) {
        let parentDoc = Acc_ChartAccount.findOne({_id: data.subAccountOf});
        if (parentDoc) {
            data.level = parentDoc.level + 1;
        }
        return Acc_ChartAccount.insert(data);
    },
    updateChartAccount(data) {
        let parentDoc = Acc_ChartAccount.findOne({_id: data.subAccountOf});
        data.level = 0;
        if (parentDoc) {
            data.level = parentDoc.level + 1;
        }
        return Acc_ChartAccount.update({_id: data._id},
            {
                $set: data
            });
    },
    updateMapFixedAsset(mapFixedAssetDoc) {
        let obj = {};
        obj.mapFixedAsset = mapFixedAssetDoc;
        return Acc_ChartAccount.update({_id: mapFixedAssetDoc.fixedAssetId},
            {
                $set: obj
            });
    },
    removeChartAccount(id) {
        return Acc_ChartAccount.remove({_id: id});
    }
});