if (false) {

    //Reference View
    db.createView('vw_reference', "wb_reference",
        [
            {
                $lookup: {
                    from: "wb_referenceType",
                    localField: "referenceTypeId",
                    foreignField: "_id",
                    as: "referenceTypeDoc"
                }
            },
            {$unwind: {path: "$referenceTypeDoc", preserveNullAndEmptyArrays: true}}

        ])

    //Meter Reading View
    db.createView('vw_metersReading', 'wb_metersReading',
        [
            {
                $lookup: {
                    from: "wb_customerType",
                    localField: "customerTypeId",
                    foreignField: "_id",
                    as: "customerTypeDoc"
                }
            },
            {$unwind: {path: "$customerTypeDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_district",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDoc"
                }
            },
            {$unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_quartier",
                    localField: "quartierId",
                    foreignField: "_id",
                    as: "quartierDoc"
                }
            },
            {$unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_block",
                    localField: "blockId",
                    foreignField: "_id",
                    as: "blockDoc"
                }
            },
            {$unwind: {path: "$blockDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDoc"
                }
            },
            {$unwind: {path: "$categoryDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_class",
                    localField: "classId",
                    foreignField: "_id",
                    as: "classDoc"
                }
            },
            {$unwind: {path: "$classDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_operationCode",
                    localField: "operationCodeId",
                    foreignField: "_id",
                    as: "operationCodeDoc"
                }
            },
            {$unwind: {path: "$operationCodeDoc", preserveNullAndEmptyArrays: true}}
        ]
    )

    //customer View
    db.createView('vw_customer', 'wb_customer',
        [
        {
            $lookup: {
                from: "wb_district",
                localField: "district",
                foreignField: "_id",
                as: "districtDoc"
            }
        },
        {$unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "wb_quartier",
                localField: "quartier",
                foreignField: "_id",
                as: "quartierDoc"
            }
        },
        {$unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "wb_block",
                localField: "block",
                foreignField: "_id",
                as: "blockDoc"
            }
        },
        {$unwind: {path: "$blockDoc", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "wb_category",
                localField: "category",
                foreignField: "_id",
                as: "categoryDoc"
            }
        },
        {$unwind: {path: "$categoryDoc", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "wb_group",
                localField: "group",
                foreignField: "_id",
                as: "groupDoc"
            }
        },
        {$unwind: {path: "$groupDoc", preserveNullAndEmptyArrays: true}},


        {
            $lookup: {
                from: "WB_Tariff",
                localField: "tariff",
                foreignField: "_id",
                as: "tariffDoc"
            }
        },
        {$unwind: {path: "$tariffDoc", preserveNullAndEmptyArrays: true}},

        {
            $lookup: {
                from: "wb_class",
                localField: "class",
                foreignField: "_id",
                as: "classDoc"
            }
        },
        {$unwind: {path: "$classDoc", preserveNullAndEmptyArrays: true}},

        {
            $lookup: {
                from: "WB_Position",
                localField: "position",
                foreignField: "_id",
                as: "positionDoc"
            }
        },
        {$unwind: {path: "$positionDoc", preserveNullAndEmptyArrays: true}}
    ])

    //Quarter View
    db.createView('vw_quartier', "wb_quartier",
        [

            {
                $lookup: {
                    from: "wb_district",
                    localField: "districtCodeId",
                    foreignField: "_id",
                    as: "districtDoc"
                }
            },
            {$unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}}

        ])

    //Block View
    db.createView('vw_block', "wb_block",
        [
            {
                $lookup: {
                    from: "wb_quartier",
                    localField: "quartierId",
                    foreignField: "_id",
                    as: "quartierDoc"
                }
            },
            {$unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: "wb_district",
                    localField: "districtCode",
                    foreignField: "_id",
                    as: "districtDoc"
                }
            },
            {$unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}}

        ])

    //Class View
    db.createView('vw_class', "wb_class",
        [

            {
                $lookup: {
                    from: "wb_category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDoc"
                }
            },
            {$unwind: {path: "$categoryDoc", preserveNullAndEmptyArrays: true}}

        ]);


    db.createView('vw_customerForSum', 'wb_customer',
        [
            {
            $project: {
                street: { $substr: ["$streetNo", 3, -1] },
                _id: 1,
                name: 1,
                khName: 1,
                dpc: 1,
                district: 1,
                quartier: 1,
                block: 1,
                folio: 1,
                successor: 1,
                category: 1,
                activity: 1,
                group: 1,
                tariff: 1,
                class: 1,
                position: 1,
                operationCode: 1,
                streetNo: 1,
                address: 1,
                newReading: 1,
                prevReading: 1,
                prevReadingDate: 1,
                newReadingDate: 1,
                avgWaterConsumption:1,
                meterType: '$contract.meterTypeId',
                meterCode: '$contract.meterCode'

            }
        }, {
            $match: { street: { $lt: "480" },position:'active' }
        },
            {
                $lookup: {
                    from: 'wb_metercode',
                    localField: 'meterCode',
                    foreignField: '_id',
                    as: 'meterCodeDoc',
                }
            },

            {
                $lookup: {
                    from: 'wb_activity',
                    localField: 'activity',
                    foreignField: '_id',
                    as: 'activityDoc',
                }
            },
            {
                $lookup: {
                    from: 'wb_meterType',
                    localField: 'meterType',
                    foreignField: '_id',
                    as: 'meterTypeDoc',
                }
            },
            {
                $lookup: {
                    from: 'wb_tariff',
                    localField: 'tariff',
                    foreignField: '_id',
                    as: 'tariffDoc',
                }
            },
            {
                $lookup: {
                    from: 'wb_category',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDoc',
                }
            },
            {
                $lookup: {
                    from: 'wb_district',
                    localField: 'district',
                    foreignField: '_id',
                    as: 'districtDoc',
                }
            }, {
            $lookup: {
                from: 'wb_quartier',
                localField: 'quartier',
                foreignField: '_id',
                as: 'quartierDoc',
            }
        }, {
            $lookup: {
                from: 'wb_block',
                localField: 'block',
                foreignField: '_id',
                as: 'blockDoc',
            }
        },

            { $unwind: { path: '$activityDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$meterCodeDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$meterTypeDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$tariffDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$districtDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$quartierDoc', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$blockDoc', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    Name: '$name',
                    //  khName: 1,
                    'Search Name': '$streetNo',
                    Street: '$streetNo',
                    Address: '$address',
                    'Phone No': '',
                    'Customer Posting Group': '1',
                    'Payment Terms Code': '25D',
                    'Country Region Code': '',
                    'Collection Method':'',
                    Amount:'',
                    'Application Method':'',
                    'Gen Bus Posting Group':'1',
                    Tariff:'$tariffDoc.code',
                    'Water Billing Cust':'',
                    Category:'$categoryDoc.code',
                    Activity:'$activityDoc.code',
                    Class:'$tariffDoc.code',
                    Type:'$tariffDoc.code',
                    'Sub-Group':'',
                    'Contract No':'N/A',
                    'Contract Date':'',
                    Position:'Active',
                    'Ave Water Consumption':'$avgWaterConsumption',
                    District:'$districtDoc.code',
                    Quartier:{$concat:['$districtDoc.code','$quartierDoc.code']},
                    Block:'$blockDoc.code',
                    Folio:'$folio',
                    Zone:'01',
                    DPC:'$dpc',
                    Successor:'$sucessor',
                    'Prev Reading Date':'$prevReadingDate',
                    'Prev Reading':'$prevReading',
                    'Meter No':'KENT',//'$meterCodeDoc.code'
                    'Meter Diameter':'$meterTypeDoc.diameter',
                    'Meter Inst Date':'',
                    'Family Head':'0',
                    'Table Room':'0',
                    'Sub Class':'',
                    Office:'',
                    ReferenceNo:'',
                    FormNo:'',
                    'Validity Date':'',
                    'Operation Code':'01-New Customer',
                    'Meter Change':'FALSE',
                    MeterCust:'M-Meter Customer',
                    'Meter Serial No':'',
                    'Name (Khmer)':'$khName'

                }
            }
        ]);
}
