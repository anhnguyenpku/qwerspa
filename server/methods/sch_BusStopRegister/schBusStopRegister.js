import {Sch_BusRegister} from '../../../imports/collection/schBusRegister';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchBusRegister({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchBusRegister: 0,
            };
            let selector = {};
            //selector.status = "Active";
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [
                        {"studentDoc.personal.name": {$regex: reg, $options: 'mi'}},
                        {
                            "busDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }, {
                            "busStopDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        },
                        {
                            "busStopType": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        },
                        {
                            "price": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }
                    ];
                }
            }
            let schBusRegisters = Sch_BusRegister.aggregate([
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
                        from: "sch_student",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "studentDoc"

                    }
                },

                {
                    $unwind: {
                        path: "$studentDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "sch_bus",
                        localField: "busId",
                        foreignField: "_id",
                        as: "busDoc"

                    }
                },

                {
                    $unwind: {
                        path: "$busDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "sch_busStop",
                        localField: "busStopId",
                        foreignField: "_id",
                        as: "busStopDoc"

                    }
                },

                {
                    $unwind: {
                        path: "$busStopDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            if (schBusRegisters.length > 0) {
                data.content = schBusRegisters;
                let busReg = Sch_BusRegister.aggregate([
                    {
                        $lookup: {
                            from: "sch_student",
                            localField: "studentId",
                            foreignField: "_id",
                            as: "studentDoc"

                        }
                    },

                    {
                        $unwind: {
                            path: "$studentDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "sch_bus",
                            localField: "busId",
                            foreignField: "_id",
                            as: "busDoc"

                        }
                    },

                    {
                        $unwind: {
                            path: "$busDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "sch_busStop",
                            localField: "busStopId",
                            foreignField: "_id",
                            as: "busStopDoc"

                        }
                    },

                    {
                        $unwind: {
                            path: "$busStopDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: selector
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {$sum: 1}
                        }
                    }
                ]);
                let schBusRegisterTotal = busReg[0].total;
                data.countSchBusRegister = schBusRegisterTotal;
            }
            return data;
        }
    },
    querySchBusRegisterById(id) {
        let data = Sch_BusRegister.findOne({_id: id});
        return data;
    },
    insertSchBusRegister(data) {
        let doc = Sch_BusRegister.insert(data);
        return doc;
    },
    updateSchBusRegister(data) {
        let doc = Sch_BusRegister.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchBusRegister(id) {
        return Sch_BusRegister.remove({_id: id});
    }
});