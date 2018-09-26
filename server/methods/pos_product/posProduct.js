import {Pos_Product} from '../../../imports/collection/posProduct';
import {Pos_ProductReact} from '../../../imports/collection/posProduct';
import {Pos_Unit} from '../../../imports/collection/posUnit';

import {SpaceChar} from "../../../both/config.js/space"
import {Pos_PayBillReact} from "../../../imports/collection/posPayBill";

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
                    selector.$or = [
                        {name: {$regex: reg, $options: 'mi'}},
                        {
                            code: {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }];
                }
            }
            let posProducts = Pos_Product.aggregate([
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
                    }
                    ,
                    {
                        $skip: options.skip
                    }
                    ,
                    {
                        $lookup: {
                            from: "pos_category",
                            localField:
                                "categoryId",
                            foreignField:
                                "_id",
                            as:
                                "categoryDoc"
                        }
                    }
                    ,
                    {
                        $unwind: {
                            path: "$categoryDoc", preserveNullAndEmptyArrays:
                                true
                        }
                    }
                    ,
                    {
                        $project: {
                            _id: 1,
                            name:
                                1,
                            code:
                                1,
                            level:
                                1,
                            description:
                                1,
                            productType:
                                1,
                            rePrice:
                                1,
                            whPrice:
                                1,
                            qtyOnHand:
                                1,
                            cost:
                                1,
                            barcode:
                                1,
                            isTaxable:
                                1,
                            categoryName:
                                {
                                    $concat: ["$categoryDoc.code", " : ", "$categoryDoc.name"]
                                }
                        }
                    }
                ])
            ;
            if (posProducts.length > 0) {
                data.content = posProducts;
                let posProductTotal = Pos_Product.find(selector).count();
                data.countPosProduct = posProductTotal;
            }
            return data;
        }
    },
    queryPosProductById(val) {
        let selector = {};
        selector.$or = [
            {_id: val},
            {code: val + ""}
        ];
        let data = Pos_Product.findOne(selector);
        if (data && data.unitId) {
            let unitDoc = Pos_Unit.findOne({_id: data.unitId});
            if (unitDoc) {
                data.unitName = unitDoc.name;
            }
        }
        return data;
    },
    insertPosProduct(data) {
        let isInserted = Pos_Product.insert(data);
        if (isInserted) {
            productReact(isInserted);
        }
        return isInserted;
    },
    updatePosProduct(data) {
        let id = data._id;
        let isUpdated = Pos_Product.update({_id: data._id},
            {
                $set: data
            });

        if (isUpdated) {
            productReact(id);
        }
        return isUpdated;
    },
    removePosProduct(id) {
        let isRemoved = Pos_Product.remove({_id: id});
        productReact(id);
        return isRemoved;
    },
    getProductCodeByCateogry(categoryId) {
        let productDoc = Pos_Product.findOne({categoryId: categoryId}, {sort: {code: -1}});
        if (productDoc) {
            return (parseInt(productDoc.code) + 1) + "";
        }
        return "";
    }
});


let productReact = function (id) {
    let doc = Pos_ProductReact.findOne();
    if (doc) {
        Pos_ProductReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Pos_ProductReact.insert({
            id: id
        });
    }
}