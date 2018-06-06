import {Meteor} from 'meteor/meteor';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal.js';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {WB_Block} from '../../../imports/collection/block';
Meteor.methods({
    saleReport(params){
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
            let isContributeFee=false;
           if(params.isContributionFee=="1"){
               isContributeFee=true;
           }

            let sales= WB_MeterReadingJournalDetail.aggregate([
                {$match: selector},
                {
                    $project: {
                        street:1,
                        dpc:1,
                        customerId: 1,
                        category: 1,
                        class: 1,
                        district: 1,
                        quartier: 1,
                        block: 1,
                        waterConsumption: 1,
                        maintenanceFee: {$cond: [ {$gt:["$waterConsumption",0]},"$maintenanceFee", 0]},
                        contributionFee: {$cond: [isContributeFee, '$contributionFee', 0]},
                        total: 1,
                        grandTotal: {$cond: [{$gt:["$waterConsumption",0]},{$cond: [isContributeFee, '$grandTotal', {$subtract: ['$grandTotal',"$contributionFee"]}]},0]}
                    }
                },
                {
                    $lookup: {
                        from: 'wb_customer',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_category',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDoc'
                    }
                }, {
                    $lookup: {
                        from: 'wb_class',
                        localField: 'class',
                        foreignField: '_id',
                        as: 'classDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_district',
                        localField: 'district',
                        foreignField: '_id',
                        as: 'districtDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_quartier',
                        localField: 'quartier',
                        foreignField: '_id',
                        as: 'quartierDoc'
                    }
                },
                {
                    $lookup: {
                        from: 'wb_block',
                        localField: 'block',
                        foreignField: '_id',
                        as: 'blockDoc'
                    }
                },
                {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
                {
                    $lookup: {
                        from: 'wb_meterType',
                        localField: 'customerDoc.contract.meterTypeId',
                        foreignField: '_id',
                        as: 'meterTypeDoc'
                    }
                },
                {$unwind: {path: '$categoryDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$classDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$districtDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$quartierDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
                {$unwind: {path: '$meterTypeDoc', preserveNullAndEmptyArrays: true}},
                {$sort:{"dpc": 1}},
                {
                    $group: {
                        _id: null,
                        data: {
                            $push: '$$ROOT'
                        },
                        totalGrandTtoal: {
                            $sum: "$grandTotal"
                        },
                        totalInvoice:{
                            $sum: {$cond:[{$gt:["$waterConsumption",0]} ,1,0] }
                        },
                        totalWaterConsumption:{
                            $sum: "$waterConsumption"
                        },
                        totalMaintenanceFee:{
                            $sum: "$maintenanceFee"
                        },
                        totalContributionFee:{
                            $sum: "$contributionFee"
                        },
                        total:{
                            $sum: "$total"
                        }
                    }
                }
            ],{ allowDiskUse: true });

           if(sales[0]){
               let biilingSetup=WB_waterBillingSetup.findOne({});
               sales[0].shortNameCompany=biilingSetup.enShortName;
               sales[0].monthYear=moment(params.date[1]).format("MM-YYYY");
               let blockDoc=WB_Block.findOne({_id: params.block});

               sales[0].block= blockDoc.name;
               sales[0].dayFooter= moment(params.date[1]).format("DD");
               sales[0].monthFooter= moment(params.date[1]).format("MM");
               sales[0].yearFooter= moment(params.date[1]).format("YYYY");

               sales[0].position= sales[0].data[0].dpc.substr(0,6);


           }

            // console.log(sales[0].data[0].customerDoc.dpc);
            return sales[0];
    }
});