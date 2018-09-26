import {Sch_Promotion} from '../../../imports/collection/schPromotion';
import {Sch_PromotionReact} from '../../../imports/collection/schPromotion';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_ProgramReact} from "../../../imports/collection/schProgram";

Meteor.methods({
    querySchPromotion({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchPromotion: 0,
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
                    }, {
                        khName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcPromotions = Sch_Promotion.aggregate([
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
            if (shcPromotions.length > 0) {
                data.content = shcPromotions;
                let shcPromotionTotal = Sch_Promotion.find(selector).count();
                data.countSchPromotion = shcPromotionTotal;
            }
            return data;
        }
    },
    querySchPromotionById(id) {
        let data = Sch_Promotion.findOne({_id: id});
        return data;
    },
    insertSchPromotion(data) {
        let doc = Sch_Promotion.insert(data);
        if (doc) {
            promotionReact(doc);
        }
        return doc;
    },
    updateSchPromotion(data) {
        let id = data._id;
        let doc = Sch_Promotion.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            promotionReact(id);
        }
        return doc;
    },
    removeSchPromotion(id) {
        let isRemoved = Sch_Promotion.remove({_id: id});
        if (isRemoved) {
            promotionReact(id);
        }
        return isRemoved;
    }
});


let promotionReact = function (id) {
    let doc = Sch_PromotionReact.findOne();
    if (doc) {
        Sch_PromotionReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_PromotionReact.insert({
            id: id
        });
    }
}