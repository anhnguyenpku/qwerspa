import {Pos_Location} from '../../../imports/collection/posLocation';
import {Pos_LocationReact} from '../../../imports/collection/posLocation';

import {SpaceChar} from "../../../both/config.js/space"
import {Pos_InvoiceReact} from "../../../imports/collection/posInvoice";

Meteor.methods({
    queryPosLocation({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countPosLocation: 0,
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
                        address: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {
                        phoneNumber: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {description: {$regex: reg, $options: 'mi'}}];
                }
            }
            let posLocations = Pos_Location.aggregate([
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
            if (posLocations.length > 0) {
                data.content = posLocations;
                let posLocationTotal = Pos_Location.find(selector).count();
                data.countPosLocation = posLocationTotal;
            }
            return data;
        }
    },
    queryPosLocationById(id) {
        let data = Pos_Location.findOne({_id: id});
        return data;
    },
    insertPosLocation(data) {
        let doc = Pos_Location.insert(data);

        if (data.isMainLocation == true) {
            Pos_Location.direct.update({_id: {$ne: doc._id}}, {$set: {isMainLocation: false}}, {multi: true});
        }

        if (doc) {
            locationReact(doc);
        }
        return doc;
    },
    updatePosLocation(data) {
        let id = data._id;
        let doc = Pos_Location.update({_id: data._id},
            {
                $set: data
            });

        if (data.isMainLocation == true) {
            let d = Pos_Location.direct.update({_id: {$ne: id}}, {$set: {isMainLocation: false}}, {multi: true});
        }
        if (doc) {
            locationReact(data._id);
        }
        return doc;
    },
    removePosLocation(id) {
        let isRemoved = Pos_Location.remove({_id: id});
        if (isRemoved) {
            locationReact(id);
        }
        return isRemoved;
    }
});


let locationReact = function (id) {
    let doc = Pos_LocationReact.findOne();
    if (doc) {
        Pos_LocationReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Pos_LocationReact.insert({
            id: id
        });
    }
}