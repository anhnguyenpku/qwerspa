import {UserSchema} from '../../../imports/collection/userSchema';
import {UserSchemaReact} from '../../../imports/collection/userSchema';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_TimeReact} from "../../../imports/collection/schTime";

Meteor.methods({
    queryWbUserSetting({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchUserSetting: 0,
            };
            let selector = {};
            selector.username = {$ne: "super"};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}];
                }
            }
            let wbUserSettings = Meteor.users.aggregate([
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
            if (wbUserSettings.length > 0) {
                data.content = wbUserSettings;
                let wbUserSettingTotal = Meteor.users.find(selector).count();
                data.countWbUserSetting = wbUserSettingTotal;
            }
            return data;
        }
    },
    queryWbUserSettingById(id) {
        let data = Meteor.users.findOne({_id: id});
        return data;
    },
    removeWbUserSetting(id) {
        let isRemoved = Meteor.users.remove({_id: id});
        if (isRemoved) {
            Meteor.call("userSchemaReact", id);
        }
        return isRemoved;
    },
    userSchemaReact(id) {
        let doc = UserSchemaReact.findOne();
        if (doc) {
            UserSchemaReact.update({_id: doc._id}, {
                $set: {
                    id: id
                }
            });
        } else {
            UserSchemaReact.insert({
                id: id
            });
        }
    }
});

