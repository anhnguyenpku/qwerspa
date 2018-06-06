import {Manage_Module} from '../../../imports/collection/manageModule';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    queryManageModule() {
        let data = Manage_Module.findOne({});
        return data;
    },
    insertUpdateMangeModule(data) {
        if (data._id != "") {
            return Manage_Module.update({_id: data._id}, {$set: data});
        } else {
            return Manage_Module.insert(data);
        }
    }
});