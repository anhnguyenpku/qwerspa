import {Sch_Mention} from '../../../imports/collection/schMention';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchMention({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchMention: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {
                        dateName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }];
                }
            }
            let shcMentions = Sch_Mention.aggregate([
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
            if (shcMentions.length > 0) {
                data.content = shcMentions;
                let shcMentionTotal = Sch_Mention.find(selector).count();
                data.countSchMention = shcMentionTotal;
            }
            return data;
        }
    },
    querySchMentionById(id) {
        let data = Sch_Mention.findOne({_id: id});
        return data;
    },
    querySchMentionByActive(role) {
        let data = Sch_Mention.findOne({status: true, rolesArea: role});
        return data;
    },
    insertSchMention(data) {
        let doc = Sch_Mention.insert(data);
        return doc;
    },
    updateSchMention(data) {
        let doc = Sch_Mention.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchMention(id) {
        return Sch_Mention.remove({_id: id});
    }
});