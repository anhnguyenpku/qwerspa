import {WB_ChangeBlock} from '../../../imports/collection/changeBlock';

Meteor.methods({
    queryChangeBlock({q, filter, customerId, options = {limit: 10, skip: 0}}) {
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
                    selector.$or = [
                        {'blockDoc.code': {$regex: reg, $options: 'mi'}},
                        {'blockDoc.name': {$regex: reg, $options: 'mi'}},
                        {newStreet: {$regex: reg, $options: 'mi'}},
                        {"quartierDoc.code": {$regex: reg, $options: 'mi'}},
                        {"quartierDoc.name": {$regex: reg, $options: 'mi'}},
                        {"districtDoc.name": {$regex: reg, $options: 'mi'}},
                        {"districtDoc.code": {$regex: reg, $options: 'mi'}},
                        {newSuccessor: {$regex: reg, $options: 'mi'}}
                    ];
                }
            }
            let changeBlock = WB_ChangeBlock.aggregate([
                {
                    $match: {
                        customerId: customerId
                    }
                },
                {
                    $lookup: {
                        from: "wb_block",
                        localField: "newBlock",
                        foreignField: "_id",
                        as: "blockDoc"
                    }
                },
                {
                    $unwind: {path: "$blockDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $lookup: {
                        from: "wb_quartier",
                        localField: "newQuartier",
                        foreignField: "_id",
                        as: "quartierDoc"
                    }
                },
                {
                    $unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $lookup: {
                        from: "wb_district",
                        localField: "newDistrict",
                        foreignField: "_id",
                        as: "districtDoc"
                    }
                },
                {
                    $unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $match: selector
                },
                {
                    $project: {
                        _id: 1,
                        changeDate: 1,
                        blockDoc: 1,
                        quartierDoc: 1,
                        districtDoc: 1,
                        newDPC: 1,
                        blockDisplay: {$concat: ["$blockDoc.code", " : ", "$blockDoc.name"]},
                        quartierDisplay: {$concat: ["$quartierDoc.code", " : ", "$quartierDoc.name"]},
                        districtDisplay: {$concat: ["$districtDoc.code", " : ", "$districtDoc.name"]}

                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                },
                {
                    $sort: {
                        "changeDate": -1
                    }
                }
            ]);
            if (changeBlock.length > 0) {
                data.content = changeBlock;
                let changeBlockTotal = WB_ChangeBlock.find(selector).count();
                data.countChangeBlock = changeBlockTotal;
            }
            return data;
        }
    },
    queryChangeBlockById(id) {
        let data = WB_ChangeBlock.findOne({_id: id});
        return data;
    },
    insertChangeBlock(data) {
        return WB_ChangeBlock.insert(data);
    },
    removeChangeBlock(id) {
        return WB_ChangeBlock.remove({_id: id});
    },
    queryChangeBlockOneSortByDate(rolesArea, customerId) {
        let doc = WB_ChangeBlock.findOne({rolesArea: rolesArea, customerId: customerId}, {sort: {changeDate: -1}});
        return doc;
    }
});