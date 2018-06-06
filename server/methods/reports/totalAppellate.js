import {Meteor} from 'meteor/meteor';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {WB_Block} from '../../../imports/collection/block';
import {WB_Tariff} from '../../../imports/collection/tariff';
import {WB_Category} from '../../../imports/collection/category';
import {WB_Customer} from '../../../imports/collection/customer';

Meteor.methods({
    totalAppellateReport(params) {
        let selector = {};
        let selectorCus = {};

        selectorCus["contract.prevReading"] = 0;
        selectorCus.prevReading = 0;
        selectorCus.meterChangeHistoryId = null;

        if (params.date) {
            let startDate = moment(params.date[0]).startOf('days').toDate();
            let endDate = moment(params.date[1]).endOf('days').toDate();
            selector.newReadingDate = {$gte: startDate, $lte: endDate};
        }
        if (params.district && params.district != '') {
            selector.district = params.district;
            selectorCus.district = params.district;
        }
        if (params.quartier && params.quartier != '') {
            selector.quartier = params.quartier;
            selectorCus.quartier = params.quartier;
        }
        if (params.block && params.block != '') {
            selector.block = params.block;
            selectorCus.block = params.block;
        }
        if (params.category && params.category != '') {
            selector.category = params.category;
            selectorCus.category = params.category;
        }

        let isContributeFee=false;
        if(params.isContributionFee=="1"){
            isContributeFee=true;
        }

        let totalAppellate = WB_MeterReadingJournalDetail.aggregate([
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
            {$sort: {"customerDoc.category": 1, "customerDoc.tariff": 1, "customerDoc.class": 1}},

            {
                $group: {
                    _id: {
                        category: "$customerDoc.category",
                        level: "$level",
                        class: "$customerDoc.class"

                    },
                    totalInvoice: {$sum: 1},
                    totalInvoiceNotZero: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, 1, 0]}},
                    totalConsumption: {$sum: "$waterConsumption"},
                    total: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$total", 0]}},
                    totalMaintenance: {$sum: {$cond: [{$gt: ["$waterConsumption", 0]}, "$maintenanceFee", 0]}},
                    totalContributionFee: {$sum: {$cond: [{$and: [{$gt: ["$waterConsumption", 0]},isContributeFee]}, "$contributionFee", 0]}}
                }
            },
            {
                $group: {
                    _id: {
                        category: "$_id.category",
                        class: "$_id.class"
                    },
                    data: {$push: "$$ROOT"}

                }

            }
        ], {allowDiskUse: true})


        let numBlock = WB_MeterReadingJournalDetail.aggregate([
            {$match: selector},
            {
                $group: {
                    _id: {block: "$block"},
                    numBlockList: {$sum: 1}
                }

            },
            {
                $group: {
                    _id: null,
                    totalBlock: {$sum: 1}
                }
            }
        ]);

        let idDomestic = WB_Category.findOne({code: "1"});
        let idCommercial = WB_Category.findOne({code: "2"});
        let idAdministrative = WB_Category.findOne({code: "3"});


        let dataObj = {};

        let biilingSetup = WB_waterBillingSetup.findOne({});
        dataObj.shortNameCompany = biilingSetup.enShortName;
        dataObj.monthYear = moment(params.date[1]).format("MM-YYYY");
        dataObj.dayFooter = moment(params.date[1]).format("DD");
        dataObj.monthFooter = moment(params.date[1]).format("MM");
        dataObj.yearFooter = moment(params.date[1]).format("YYYY");


        let invoiceDomestic = 0;
        let invoiceCommercial = 0;
        let invoiceAdministrative = 0;
        let totalRawInvoice = 0;

        let levelOneQtyDomestic = 0;
        let levelOneQtyCommercial = 0;
        let levelOneQtyAdministrative = 0;


        let levelTwoQtyDomestic = 0;
        let levelTwoQtyCommercial = 0;
        let levelTwoQtyAdministrative = 0;

        let totalQtyDomestic = 0;
        let totalQtyCommercial = 0;
        let totalQtyAdministrative = 0;


        let levelOnePriceDomestic = 0;
        let levelOnePriceCommercial = 0;
        let levelOnePriceAdministrative = 0;

        let levelTwoPriceDomestic = 0;
        let levelTwoPriceCommercial = 0;
        let levelTwoPriceAdministrative = 0;

        let totalPriceDomestic = 0;
        let totalPriceCommercial = 0;
        let totalPriceAdministrative = 0;


        let maintenanceDomestic = 0;
        let maintenanceCommercial = 0;
        let maintenanceAdministrative = 0;

        let contributionDomestic = 0;
        let contributionCommercial = 0;
        let contributionAdministrative = 0;


        totalAppellate.forEach(function (obj) {
            if (obj._id.category == idDomestic._id && obj.data) {

                obj.data.forEach(function (ob) {
                    invoiceDomestic += ob.totalInvoiceNotZero;
                    totalRawInvoice += ob.totalInvoice;

                    maintenanceDomestic += ob.totalMaintenance;
                    contributionDomestic += ob.totalContributionFee;

                    totalQtyDomestic += ob.totalConsumption;
                    totalPriceDomestic += ob.total;
                    if (ob._id.level == 1) {
                        levelOneQtyDomestic += ob.totalConsumption;
                        levelOnePriceDomestic += ob.total;
                    } else if (ob._id.level == 2) {
                        levelTwoQtyDomestic += ob.totalConsumption;
                        levelTwoPriceDomestic += ob.total;
                    }
                })


            } else if (obj._id.category == idCommercial._id && obj.data) {
                obj.data.forEach(function (ob) {
                    invoiceCommercial += ob.totalInvoiceNotZero;
                    totalRawInvoice += ob.totalInvoice;

                    maintenanceCommercial += ob.totalMaintenance;
                    contributionCommercial += ob.totalContributionFee;

                    totalQtyCommercial += ob.totalConsumption;
                    totalPriceCommercial += ob.total;
                    if (ob._id.level == 1) {
                        levelOneQtyCommercial += ob.totalConsumption;
                        levelOnePriceCommercial += ob.total;
                    } else if (ob._id.level == 2) {
                        levelTwoQtyCommercial += ob.totalConsumption;
                        levelTwoPriceCommercial += ob.total;
                    }

                })
            } else if (obj._id.category == idAdministrative._id && obj.data) {
                obj.data.forEach(function (ob) {
                    invoiceAdministrative += ob.totalInvoiceNotZero;
                    totalRawInvoice += ob.totalInvoice;

                    maintenanceAdministrative += ob.totalMaintenance;
                    contributionAdministrative += ob.totalContributionFee;

                    totalQtyAdministrative += ob.totalConsumption;
                    totalPriceAdministrative += ob.total;
                    if (ob._id.level == 1) {
                        levelOneQtyAdministrative += ob.totalConsumption;
                        levelOnePriceAdministrative += ob.total;
                    } else if (ob._id.level == 2) {
                        levelTwoQtyAdministrative += ob.totalConsumption;
                        levelTwoPriceAdministrative += ob.total;
                    }

                })
            }

        })


        let newCus = WB_Customer.aggregate([
            {$match: selectorCus},
            {
                $group: {
                    _id: null,
                    totalNewCus: {$sum: 1}
                }
            }

        ]);


        dataObj.invoiceDomestic = invoiceDomestic;
        dataObj.invoiceCommercial = invoiceCommercial;
        dataObj.invoiceAdministrative = invoiceAdministrative;
        dataObj.totalInvoice = invoiceAdministrative + invoiceDomestic + invoiceCommercial;
        dataObj.totalRawInvoice = totalRawInvoice;


        dataObj.totalQtyDomestic = totalQtyDomestic;
        dataObj.totalPriceDomestic = totalPriceDomestic;
        dataObj.levelOneQtyDomestic = levelOneQtyDomestic;
        dataObj.levelOnePriceDomestic = levelOnePriceDomestic;
        dataObj.levelTwoQtyDomestic = levelTwoQtyDomestic;
        dataObj.levelTwoPriceDomestic = levelTwoPriceDomestic;
        dataObj.maintenanceDomestic = maintenanceDomestic;
        dataObj.contributionDomestic = contributionDomestic;
        dataObj.totalDomestic = totalPriceDomestic + maintenanceDomestic+contributionDomestic;


        dataObj.totalQtyCommercial = totalQtyCommercial;
        dataObj.totalPriceCommercial = totalPriceCommercial;
        dataObj.levelOneQtyCommercial = levelOneQtyCommercial;
        dataObj.levelOnePriceCommercial = levelOnePriceCommercial;
        dataObj.levelTwoQtyCommercial = levelTwoQtyCommercial;
        dataObj.levelTwoPriceCommercial = levelTwoPriceCommercial;
        dataObj.maintenanceCommercial = maintenanceCommercial;
        dataObj.contributionCommercial = contributionCommercial;
        dataObj.totalCommercial = totalPriceCommercial + maintenanceCommercial+contributionCommercial;


        dataObj.totalQtyAdministrative = totalQtyAdministrative;
        dataObj.totalPriceAdministrative = totalPriceAdministrative;
        dataObj.levelOneQtyAdministrative = levelOneQtyAdministrative;
        dataObj.levelOnePriceAdministrative = levelOnePriceAdministrative;
        dataObj.levelTwoQtyAdministrative = levelTwoQtyAdministrative;
        dataObj.levelTwoPriceAdministrative = levelTwoPriceAdministrative;
        dataObj.maintenanceAdministrative = maintenanceAdministrative;
        dataObj.contributionAdministrative = contributionAdministrative;
        dataObj.totalAdministrative = totalPriceAdministrative + maintenanceAdministrative+contributionAdministrative;


        dataObj.grandTotalQty = totalQtyDomestic + totalQtyCommercial + totalQtyAdministrative;
        dataObj.grandTotalPrice = totalPriceDomestic + totalPriceCommercial + totalPriceAdministrative;
        dataObj.grandTotallevelOneQty = levelOneQtyDomestic + levelOneQtyCommercial + levelOneQtyAdministrative;
        dataObj.grandTotallevelOnePrice = levelOnePriceDomestic + levelOnePriceCommercial + levelOnePriceAdministrative;
        dataObj.grandTotallevelTwoQty = levelTwoQtyDomestic + levelTwoQtyCommercial + levelTwoQtyAdministrative;
        dataObj.grandTotallevelTwoPrice = levelTwoPriceDomestic + levelTwoPriceCommercial + levelTwoPriceAdministrative;
        dataObj.grandTotalMaintenance = maintenanceDomestic + maintenanceCommercial + maintenanceAdministrative;
        dataObj.grandTotalContribution = contributionDomestic + contributionCommercial + contributionAdministrative;
        dataObj.grandTotal = totalPriceDomestic + maintenanceDomestic + totalPriceCommercial + maintenanceCommercial + totalPriceAdministrative + maintenanceAdministrative+ contributionDomestic + contributionCommercial + contributionAdministrative;


        dataObj.totalBlock = numBlock[0] && numBlock[0].totalBlock;
        dataObj.totalNewCus = newCus[0] && newCus[0].totalNewCus;
        dataObj.totalCus = (newCus[0] && newCus[0].totalNewCus || 0) + totalRawInvoice;

        return dataObj;
    }
});




