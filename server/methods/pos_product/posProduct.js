import {Pos_Product} from '../../../imports/collection/posProduct';
import {Pos_Unit} from '../../../imports/collection/posUnit';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryPosProduct({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosProduct: 0,
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
                        },
                        productType: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {description: {$regex: reg, $options: 'mi'}}];
                }
            }
            let posProducts = Pos_Product.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "pos_category",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryDoc"
                    }
                },
                {
                    $unwind: {path: "$categoryDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        code: 1,
                        level: 1,
                        description: 1,
                        productType: 1,
                        rePrice: 1,
                        whPrice: 1,
                        qtyOnHand: 1,
                        cost: 1,
                        barcode: 1,
                        isTaxable: 1,
                        categoryName: {$concat: ["$categoryDoc.code", " : ", "$categoryDoc.name"]}
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (posProducts.length > 0) {
                data.content = posProducts;
                let posProductTotal = Pos_Product.find(selector).count();
                data.countPosProduct = posProductTotal;
            }
            return data;
        }
    },
    queryPosProductById(id) {
        let data = Pos_Product.findOne({_id: id});
        if (data.unitId) {
            let unitDoc = Pos_Unit.findOne({_id: data.unitId});
            if (unitDoc) {
                data.unitName = unitDoc.name;
            }
        }
        return data;
    },
    insertPosProduct(data) {
        return Pos_Product.insert(data);
    },
    updatePosProduct(data) {
        return Pos_Product.update({_id: data._id},
            {
                $set: data
            });
    },
    removePosProduct(id) {
        return Pos_Product.remove({_id: id});
    },
    getProductCodeByCateogry(categoryId) {
        let productDoc = Pos_Product.findOne({categoryId: categoryId}, {sort: {code: -1}});
        if (productDoc) {
            return (parseInt(productDoc.code) + 1) + "";
        }
        return "";
    }
});