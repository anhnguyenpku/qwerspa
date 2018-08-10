import {Sch_BusStop} from '../../../imports/collection/schBusStop';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchBusStop({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchBusStop: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {price: {$regex: reg, $options: 'mi'}}];
                }
            }
            let schBusStops = Sch_BusStop.aggregate([
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
            if (schBusStops.length > 0) {
                data.content = schBusStops;
                let schBusStopTotal = Sch_BusStop.find(selector).count();
                data.countSchBusStop = schBusStopTotal;
            }
            return data;
        }
    },
    querySchBusStopById(id) {
        let data = Sch_BusStop.findOne({_id: id});
        return data;
    },
    insertSchBusStop(data) {
        let doc = Sch_BusStop.insert(data);
        return doc;
    },
    updateSchBusStop(data) {
        let doc = Sch_BusStop.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchBusStop(id) {
        return Sch_BusStop.remove({_id: id});
    }
});