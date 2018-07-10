import {Sch_Register} from '../../../imports/collection/schRegister';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchRegister({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchRegister: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [
                        {"studentDoc.name": {$regex: reg, $options: 'mi'}},
                        {
                            "levelDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }, {
                            "programDoc.name": {
                                $regex: reg,
                                $options: 'mi'
                            }
                        }];
                }
            }
            let shcRegisters = Sch_Register.aggregate([
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
                        from: "sch_level",
                        localField: "levelId",
                        foreignField: "_id",
                        as: "levelDoc"

                    }
                },
                {
                    $unwind: {
                        path: "$levelDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "sch_program",
                        localField: "programId",
                        foreignField: "_id",
                        as: "programDoc"

                    }
                },
                {
                    $unwind: {
                        path: "$programDoc",
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
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (shcRegisters.length > 0) {
                data.content = shcRegisters;
                let shcRegisterTotal = Sch_Register.aggregate([
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
                            from: "sch_level",
                            localField: "levelId",
                            foreignField: "_id",
                            as: "levelDoc"

                        }
                    },
                    {
                        $unwind: {
                            path: "$levelDoc",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "sch_program",
                            localField: "programId",
                            foreignField: "_id",
                            as: "programDoc"

                        }
                    },
                    {
                        $unwind: {
                            path: "$programDoc",
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
                data.countSchRegister = shcRegisterTotal[0].total;
            }
            return data;
        }
    },
    querySchRegisterById(id) {
        let data = Sch_Register.findOne({_id: id});
        return data;
    },
    insertSchRegister(data) {
        let doc = Sch_Register.insert(data);
        return doc;
    },
    updateSchRegister(data) {
        let doc = Sch_Register.update({_id: data._id},
            {
                $set: data
            });
        return doc;
    },
    removeSchRegister(id) {
        return Sch_Register.remove({_id: id});
    }
});