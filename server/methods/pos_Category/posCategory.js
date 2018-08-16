import {Pos_Category} from '../../../imports/collection/posCategory';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosCategory({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosCategory: 0,
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
            let posCategorys = Pos_Category.aggregate([

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
                        from: "pos_category",
                        localField: "subCategoryOf",
                        foreignField: "_id",
                        as: "subCategoryOfDoc"
                    }
                },
                {
                    $unwind: {path: "$subCategoryOfDoc", preserveNullAndEmptyArrays: true}
                },

                {
                    $project: {
                        _id: 1,
                        name: 1,
                        code: 1,
                        subCategoryOf: 1,
                        level: 1,
                        description: 1,
                        subCategoryOfName: {$concat: ["$subCategoryOfDoc.code", " : ", "$subCategoryOfDoc.name"]}
                    }
                }
            ]);
            if (posCategorys.length > 0) {
                data.content = posCategorys;
                let posCategoryTotal = Pos_Category.find(selector).count();
                data.countPosCategory = posCategoryTotal;
            }
            return data;
        }
    },
    queryPosCategoryById(id) {
        let data = Pos_Category.findOne({_id: id});
        return data;
    },
    insertPosCategory(data) {
        let parentDoc = Pos_Category.findOne({_id: data.subCategoryOf});
        if (parentDoc) {
            data.level = parentDoc.level + 1;
        }
        return Pos_Category.insert(data);
    },
    updatePosCategory(data) {
        let parentDoc = Pos_Category.findOne({_id: data.subCategoryOf});
        data.level = 0;
        if (parentDoc) {
            data.level = parentDoc.level + 1;
        }
        return Pos_Category.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosCategory(id) {
        return Pos_Category.remove({_id: id});
    }
});