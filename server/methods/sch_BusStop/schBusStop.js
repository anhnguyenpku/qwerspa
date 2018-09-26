import {Sch_BusStop} from '../../../imports/collection/schBusStop';
import {Sch_BusStopReact} from '../../../imports/collection/schBusStop';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_BusPaymentReact} from "../../../imports/collection/schBusPayment";

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
        if (doc) {
            busStopReact(doc);
        }
        return doc;
    },
    updateSchBusStop(data) {
        let id = data._id;
        let doc = Sch_BusStop.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            busStopReact(id);
        }
        return doc;
    },
    removeSchBusStop(id) {
        let isRemoved = Sch_BusStop.remove({_id: id});
        if (isRemoved) {
            busStopReact(id);
        }
        return isRemoved;
    },
    getPriceByBusStopAndType(busStopId, type) {
        let data = Sch_BusStop.aggregate([
                {
                    $match: {_id: busStopId}
                },
                {
                    $unwind: {
                        path: "$priceRange",
                        preserveNullAndEmptyArrays: true
                    }

                },
                {
                    $match: {
                        "priceRange.type": type
                    }
                }
            ]
        );
        if (data && data.length > 0) {
            return data[0];
        }

    }
});


let busStopReact = function (id) {
    let doc = Sch_BusStopReact.findOne();
    if (doc) {
        Sch_BusStopReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_BusStopReact.insert({
            id: id
        });
    }
}

