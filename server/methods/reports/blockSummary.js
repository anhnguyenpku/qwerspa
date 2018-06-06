import {Meteor} from 'meteor/meteor';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {WB_Block} from '../../../imports/collection/block';
import {WB_Tariff} from '../../../imports/collection/tariff';
import {WB_Category} from '../../../imports/collection/category';
import {WB_Customer} from '../../../imports/collection/customer';
Meteor.methods({
    blockSummaryReport(params){
        let selector = {};

        if (params.date) {
            let startDate = moment(params.date[0]).startOf('days').toDate();
            let endDate = moment(params.date[1]).endOf('days').toDate();
            selector.newReadingDate = {$gte: startDate, $lte: endDate};
        }
        if (params.district && params.district != '') {
            selector.district = params.district;
        }
        if (params.quartier && params.quartier != '') {
            selector.quartier = params.quartier;
        }
        if (params.block && params.block != '') {
            selector.block = params.block;
        }
        if (params.category && params.category != '') {
            selector.category = params.category;
        }

        let isContributeFee = false;
        if (params.isContributionFee == "1") {
            isContributeFee = true;
        }

        let blockSummary = WB_MeterReadingJournalDetail.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "wb_customer",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            },

            {
                $unwind: {path: "$customerDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "wb_block",
                    localField: "block",
                    foreignField: "_id",
                    as: "blockDoc"
                }
            },
            {
                $unwind: {path: "$blockDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "wb_quartier",
                    localField: "blockDoc.quartierId",
                    foreignField: "_id",
                    as: "quartierDoc"
                }
            },
            {
                $unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}
            }, {
                $lookup: {
                    from: "wb_district",
                    localField: "blockDoc.districtCode",
                    foreignField: "_id",
                    as: "districtDoc"
                }
            },
            {
                $unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $project: {
                    districtCode: "$districtDoc.code",
                    quartierCode: "$quartierDoc.code",
                    blockCode: "$blockDoc.code",
                    waterConsumption: 1,
                    category: 1,
                    level: 1,
                    maintenanceFee: {$cond: [{$gt: ["$waterConsumption", 0]}, "$maintenanceFee", 0]},
                    contributionFee: {$cond: [isContributeFee, '$contributionFee', 0]},
                    total: {$cond: [{$gt: ["$waterConsumption", 0]}, '$total', 0]},
                    grandTotal: {$cond: [{$gt: ["$waterConsumption", 0]}, {$cond: [isContributeFee, '$grandTotal', {$subtract: ['$grandTotal', "$contributionFee"]}]}, 0]}
                }
            }
            ,
            {
                $group: {
                    _id: {
                        district: "$districtCode",
                        quartier: "$quartierCode",
                        block: "$blockCode"
                    },
                    invoiceDomestic1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceDomestic2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},
                    invoiceCommercial1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceCommercial2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},
                    invoiceAdmin1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceAdmin2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},

                    invoicelevel1: {$sum: {$cond: [{$and: [{$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, 1, 0]}},
                    invoicelevel2: {$sum: {$cond: [{$and: [{$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, 1, 0]}},

                    totalInvoiceNotZero: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, 1, 0]}},

                    qtyDomesticlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyDomesticlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},

                    qtyCommerciallevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyCommerciallevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},

                    qtyAdminlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyAdminlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},


                    priceDomesticlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceDomesticlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},

                    priceCommerciallevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceCommerciallevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},

                    priceAdminlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceAdminlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},


                    total: {$sum: "$total"},
                    totalConsumption: {$sum: "$waterConsumption"},
                    totalMaintenance: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$maintenanceFee", 0]}},
                    totalContributionFee: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$contributionFee", 0]}}
                }
            },
            {$sort: {"_id.district": 1, "_id.quartier": 1, "_id.block": 1}}
            , {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    grandTotalInvoice: {$sum: "$totalInvoiceNotZero"},
                    grandTotalComsumption: {$sum: "$totalConsumption"},
                    grandTotalPrice: {$sum: "$total"},
                    grandTotalMaintenance: {$sum: "$totalMaintenance"},
                    grandTotalContributionFee: {$sum: "$totalContributionFee"}
                }
            }


        ], {allowDiskUse: true})


        let biilingSetup = WB_waterBillingSetup.findOne({});

        if (blockSummary && blockSummary.length > 0) {
            blockSummary[0].shortNameCompany = biilingSetup.enShortName;
            blockSummary[0].monthYear = moment(params.date[1]).format("MM-YYYY");
            blockSummary[0].dayFooter = moment(params.date[1]).format("DD");
            ;
            blockSummary[0].monthFooter = moment(params.date[1]).format("MM");
            blockSummary[0].yearFooter = moment(params.date[1]).format("YYYY");
        }

        return blockSummary && blockSummary[0];
    },
    daikaomReport(params,selector2){
        let selector = {};

        if (params.date) {
            let startDate = moment(params.date[0]).startOf('days').toDate();
            let endDate = moment(params.date[1]).endOf('days').toDate();
            selector.newReadingDate = {$gte: startDate, $lte: endDate};
        }
        if (params.district && params.district != '') {
            selector.district = params.district;
        }
        if (params.quartier && params.quartier != '') {
            selector.quartier = params.quartier;
        }
        if (params.block && params.block != '') {
            selector.block = params.block;
        }
        if (params.category && params.category != '') {
            selector.category = params.category;
        }

        let isContributeFee = false;
        if (params.isContributionFee == "1") {
            isContributeFee = true;
        }

        let blockSummary = WB_MeterReadingJournalDetail.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "wb_customer",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            },

            {
                $unwind: {path: "$customerDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "wb_block",
                    localField: "block",
                    foreignField: "_id",
                    as: "blockDoc"
                }
            },
            {
                $unwind: {path: "$blockDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                    from: "wb_quartier",
                    localField: "blockDoc.quartierId",
                    foreignField: "_id",
                    as: "quartierDoc"
                }
            },
            {
                $unwind: {path: "$quartierDoc", preserveNullAndEmptyArrays: true}
            }, {
                $lookup: {
                    from: "wb_district",
                    localField: "blockDoc.districtCode",
                    foreignField: "_id",
                    as: "districtDoc"
                }
            },
            {
                $unwind: {path: "$districtDoc", preserveNullAndEmptyArrays: true}
            },
            {
                $project: {
                    streetNo:1,
                    dpc:1,
                    street: {$substr: ["$streetNo", 3, 3]},
                    districtCode: "$districtDoc.code",
                    quartierCode: "$quartierDoc.code",
                    blockCode: "$blockDoc.code",
                    waterConsumption: 1,
                    category: 1,
                    level: 1,
                    maintenanceFee: {$cond: [{$gt: ["$waterConsumption", 0]}, "$maintenanceFee", 0]},
                    contributionFee: {$cond: [isContributeFee, '$contributionFee', 0]},
                    total: {$cond: [{$gt: ["$waterConsumption", 0]}, '$total', 0]},
                    grandTotal: {$cond: [{$gt: ["$waterConsumption", 0]}, {$cond: [isContributeFee, '$grandTotal', {$subtract: ['$grandTotal', "$contributionFee"]}]}, 0]}
                }
            },
            {
                $match: selector2
            },
            {
                $group: {
                    _id: {
                        district: "$districtCode",
                        quartier: "$quartierCode",
                        block: "$blockCode"
                    },
                    invoiceDomestic1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceDomestic2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},
                    invoiceCommercial1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceCommercial2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},
                    invoiceAdmin1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 1]}]}, 1, 0]}},
                    invoiceAdmin2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$gt: ["$waterConsumption", 0]}, {$eq: ["$level", 2]}]}, 1, 0]}},

                    invoicelevel1: {$sum: {$cond: [{$and: [{$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, 1, 0]}},
                    invoicelevel2: {$sum: {$cond: [{$and: [{$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, 1, 0]}},

                    totalInvoiceNotZero: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, 1, 0]}},

                    qtyDomesticlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyDomesticlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},

                    qtyCommerciallevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyCommerciallevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},

                    qtyAdminlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},
                    qtyAdminlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$waterConsumption", 0]}},


                    priceDomesticlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceDomesticlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "001"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},

                    priceCommerciallevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceCommerciallevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "002"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},

                    priceAdminlevel1: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 1]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},
                    priceAdminlevel2: {$sum: {$cond: [{$and: [{$eq: ["$category", "003"]}, {$eq: ["$level", 2]}, {$gt: ["$waterConsumption", 0]}]}, "$total", 0]}},


                    total: {$sum: "$total"},
                    totalConsumption: {$sum: "$waterConsumption"},
                    totalMaintenance: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$maintenanceFee", 0]}},
                    totalContributionFee: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$contributionFee", 0]}}
                }
            },
            {$sort: { "_id.block": 1}}
            , {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                    grandTotalInvoice: {$sum: "$totalInvoiceNotZero"},
                    grandTotalComsumption: {$sum: "$totalConsumption"},
                    grandTotalPrice: {$sum: "$total"},
                    grandTotalMaintenance: {$sum: "$totalMaintenance"},
                    grandTotalContributionFee: {$sum: "$totalContributionFee"}
                }
            }


        ], {allowDiskUse: true})


        let biilingSetup = WB_waterBillingSetup.findOne({});

        if (blockSummary && blockSummary.length > 0) {
            blockSummary[0].shortNameCompany = biilingSetup.enShortName;
            blockSummary[0].monthYear = moment(params.date[1]).format("MM-YYYY");
            blockSummary[0].dayFooter = moment(params.date[1]).format("DD");
            blockSummary[0].monthFooter = moment(params.date[1]).format("MM");
            blockSummary[0].yearFooter = moment(params.date[1]).format("YYYY");
        }

        return blockSummary && blockSummary[0];
    }
});




