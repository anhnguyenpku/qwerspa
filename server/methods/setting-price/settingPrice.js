import {WB_Class} from '../../../imports/collection/class';
import {WB_Category} from '../../../imports/collection/category';
import {WB_Tariff} from '../../../imports/collection/tariff';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal'
import {WB_Customer} from '../../../imports/collection/customer';
import {WB_CustomerMeterChangeHistory} from '../../../imports/collection/customerMeterChangeHistory';


import {GeneralFunction} from '../../../imports/api/methods/generalFunction.js';

Meteor.methods({
    getTypeCollection({collection}) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (collection == '') {
            return [];
        }
        let settings = eval(collection).find({});
        settings.forEach(function (setting) {
            list.push({label: `${setting.code} | ${setting.name || ''}`, value: setting._id});
        });
        return list;
    },
    getTariff({selector, waterConsumption, row, userId}) {
        if (Meteor.userId()) {
            this.unblock();
            let tariff = WB_Tariff.findOne(selector);
            if (tariff) {
                if (tariff.typeId == '005') {
                    let meterChangeHistory;
                    let oldMeterWaterConsumption;
                    let customer = WB_Customer.findOne({_id: row.customerId});
                    let newMeterWaterConsumption = waterConsumption;
                    //calculate with meter changed (have to check with modifiedDate

                    let thisInvoice = WB_MeterReadingJournalDetail.findOne({_id: row._id});
                    if (customer.contractUpdated || thisInvoice.hasOldMeterWaterConsumption) {
                        meterChangeHistory = WB_CustomerMeterChangeHistory.findOne({_id: customer.meterChangeHistoryId}, {sort: {modifiedDate: -1}});
                        oldMeterWaterConsumption = meterChangeHistory.newContract.remainWaterConsumption;
                        if (meterChangeHistory.newContract.type != 'Edit') {
                            waterConsumption += oldMeterWaterConsumption;
                        }

                    }
                    let billingCycle = row.customerDoc.billingCycle;
                    let tariffObj = tariff.rangePrice.find(x => (x.startRange * billingCycle <= waterConsumption, x.endRange * billingCycle >= waterConsumption));
                    if (tariffObj && tariffObj.price) {
                        let price = tariffObj.price;
                        let level = tariffObj.level;
                        let total = waterConsumption * price;
                        let contributionFeePrice = tariff.contributionFeePrice;
                        Meteor.defer(function () {

                                let journalDetails3monthsHistory = WB_MeterReadingJournalDetail.find({
                                    _id: {$ne: row._id},
                                    customerId: row.customerId
                                }, {sort: {_id: -1}, limit: 2});
                                let avgWaterConsumption = waterConsumption ? waterConsumption : 0;
                                let countJournalDetail = 1;
                                if (journalDetails3monthsHistory.count() > 0) {
                                    countJournalDetail += journalDetails3monthsHistory.count();
                                    journalDetails3monthsHistory.forEach(function (journal) {
                                        avgWaterConsumption += journal.waterConsumption ? journal.waterConsumption : 0;
                                    });
                                }
                                avgWaterConsumption /= countJournalDetail;
                                let maintenance = 0;
                                if (tariff.isFixedMaintenance) {
                                    maintenance = tariff.maintenance * billingCycle;
                                } else {
                                    maintenance = GeneralFunction.roundKhmerCurrency(row.meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                                }
                                let contribution = waterConsumption * contributionFeePrice;
                                let selector = {
                                    level: level,
                                    newReading: row.newReading,
                                    expiredDate: row.expiredDate,
                                    waterConsumption: waterConsumption,
                                    price: price,
                                    modifyTime: row.modifyTime,
                                    priceList: [],
                                    total: total,
                                    contributionFeePrice: contributionFeePrice,
                                    contributionFee: contribution,
                                    written: true,
                                    maintenanceFeePrice: tariff.maintenance,
                                    maintenanceFee: maintenance,
                                    newReadingDate: row.newReadingDate,
                                    billingCycle: billingCycle,
                                    updatedBy: userId,
                                    grandTotal: maintenance + contribution + total,
                                    balance: maintenance + contribution + total,
                                    isEstimated: row.isEstimated,
                                };

                                if (customer.contractUpdated || thisInvoice.hasOldMeterWaterConsumption) {
                                    selector.hasOldMeterWaterConsumption = true;
                                    selector.oldMeterWaterConsumption = oldMeterWaterConsumption;
                                    selector.newMeterWaterConsumption = newMeterWaterConsumption;
                                    selector.meterChangeType = meterChangeHistory.newContract.type;
                                    selector.oldPrevReading = meterChangeHistory.newContract.prevReading;
                                }
                                if (meterChangeHistory) {
                                    selector.meterChangeHistory = meterChangeHistory;
                                }
                                WB_MeterReadingJournalDetail.update({_id: row._id},
                                    {
                                        $set: selector
                                    });

                                WB_Customer.direct.update({_id: row.customerId}, {
                                    $set: {
                                        avgWaterConsumption,
                                        contractUpdated: false,
                                        prevReading: row.newReading,
                                        prevReadingDate: row.newReadingDate
                                    },
                                    $unset: {
                                        desc: '' //unset desc in customer if newReading is read
                                    }
                                });
                            }
                        );
                        return {waterConsumption: waterConsumption, total: total};
                    } else {
                        throw new Meteor.Error("Can't find Setting Price Range that Contain the Water Consumption Amount of:" + waterConsumption);
                    }

                }
                else if (tariff.typeId = '007') {
                    let total = 0;
                    let pricingList = [];
                    //Make sure that range price sorted
                    let remainQty = waterConsumption;
                    tariff.rangePrice.forEach(function (rp) {
                        if (remainQty - rp.startRange > 0) {
                            let qty = remainQty - rp.endRange;
                            if (qty > 0) {
                                let usingQty = rp.endRange - rp.startRange;
                                let amount = rp.price * usingQty;
                                pricingList.push({
                                    price: rp.price,
                                    qty: usingQty,
                                    amount: amount,
                                    level: rp.level,
                                });
                                total += amount;
                            } else {
                                let usingQty = remainQty - rp.startRange;
                                let amount = rp.price * usingQty;
                                pricingList.push({
                                    price: rp.price,
                                    qty: usingQty,
                                    amount: amount,
                                    level: rp.level
                                });
                                total += amount;
                            }
                        }
                        // remainQty -= rp.endRange;
                    });
                    let contributionFeePrice = tariff.contributionFeePrice;
                    Meteor.defer(function () {
                        let meterChangeHistory;
                        let customer = WB_Customer.findOne({_id: row.customerId});
                        if (customer.contractUpdated) {
                            meterChangeHistory = WB_CustomerMeterChangeHistory.findOne({_id: customer.meterChangeHistoryId});
                        }
                        let journalDetails3monthsHistory = WB_MeterReadingJournalDetail.find({
                            _id: {$ne: row._id},
                            customerId: row.customerId
                        }, {sort: {_id: -1}, limit: 2});
                        let avgWaterConsumption = waterConsumption;
                        let countJournalDetail = 1;
                        if (journalDetails3monthsHistory.count() > 0) {
                            countJournalDetail += journalDetails3monthsHistory.count();
                            journalDetails3monthsHistory.forEach(function (journal) {
                                avgWaterConsumption += journal.waterConsumption;
                            });
                        }
                        avgWaterConsumption /= countJournalDetail;
                        let maintenance = 0;
                        if (tariff.isFixedMaintenance) {
                            maintenance = tariff.maintenance * billingCycle;
                        } else {
                            maintenance = GeneralFunction.roundKhmerCurrency(row.meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                        }
                        let contribution = waterConsumption * contributionFeePrice;

                        let selector = {
                            newReading: row.newReading,
                            expiredDate: row.expiredDate,
                            waterConsumption: waterConsumption,
                            price: 0,
                            level: 0,
                            priceList: pricingList,
                            total: total,
                            contributionFeePrice: contributionFeePrice,
                            contributionFee: contribution,
                            written: true,
                            maintenanceFeePrice: tariff.maintenance,
                            maintenanceFee: maintenance,
                            newReadingDate: row.newReadingDate,
                            billingCycle: billingCycle,
                            updatedBy: userId,
                            grandTotal: maintenance + contribution + total,
                            balance: maintenance + contribution + total
                        };
                        if (meterChangeHistory) {
                            selector.meterChangeHistory = meterChangeHistory;
                        }
                        WB_MeterReadingJournalDetail.update({_id: row._id},
                            {
                                $set: selector
                            });

                        WB_Customer.direct.update({_id: row.customerId}, {
                            $set: {
                                avgWaterConsumption,
                                contractUpdated: false,
                                prevReading: row.newReading,
                                prevReadingDate: row.newReadingDate
                            },
                            $unset: {
                                desc: '' //unset desc in customer when newReading is Read
                            }
                        });
                    });

                    return {waterConsumption: waterConsumption, total: total};
                    // let tariffObj = tariff.rangePrice.find(x => (x.startRange <= waterConsumption, x.endRange >= waterConsumption));
                    /*        let price = tariff.price;
                     WB_MeterReadingJournalDetail.update({_id: id},
                     {
                     $set: {
                     newReading: newReading,
                     waterConsumption: waterConsumption,
                     price: price,
                     total: waterConsumption * price,
                     contributionFee: waterConsumption,
                     written: true,
                     maintenanceFee: tariff.maintenance
                     }
                     })*/
                }
            } else {
                throw new Meteor.Error("Can't get Setting Price Information.")
            }
        } else {
            throw new Meteor.Error("You must be login to Post invoice ");
        }
    },
    setDescriptionToMeterReadingJournalDetail(row) {
        WB_MeterReadingJournalDetail.direct.update({_id: row._id},
            {
                $set: {desc: row.desc}
            });
    }
});