import {WB_Tariff} from '../../collection/tariff';
import {WB_CustomerMeterChangeHistory} from '../../collection/customerMeterChangeHistory';
import {WB_MeterReadingJournalDetail, Wb_meterReadingJournal} from '../../collection/meterReadingJournal';
import {WB_Customer} from '../../collection/customer';
//uploading journal book detail class
export default class UploadJBD {
    //isMobileSync use this flag for check if mobile is syncing data
    static getTariffForUpload(waterConsumption, row, customerArr, userId, isMobileSync = false) {
        userId = userId || Meteor.userId();
        if (userId) {
            let customer = customerArr.find(x => x._id === row.customerId);
            let tariff = WB_Tariff.findOne({_id: customer.tariff});
            if (tariff) {
                if (tariff.typeId === '005') {
                    let meterChangeHistory;
                    let oldMeterWaterConsumption;
                    let newMeterWaterConsumption = waterConsumption;
                    //calculate with meter changed (have to check with modifiedDate

                    let thisInvoice = WB_MeterReadingJournalDetail.findOne({_id: row._id});
                    if (customer.contractUpdated || thisInvoice.hasOldMeterWaterConsumption) {
                        meterChangeHistory = WB_CustomerMeterChangeHistory.findOne({_id: customer.meterChangeHistoryId}, {sort: {modifiedDate: -1}});
                        oldMeterWaterConsumption = meterChangeHistory.newContract.remainWaterConsumption;
                        if (meterChangeHistory.newContract.type !== 'Edit') {
                            waterConsumption += oldMeterWaterConsumption;
                        }
                    }
                    //let billingCycle = row.customerDoc.billingCycle; "In getTariff function"
                    let billingCycle = customer.billingCycle;
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
                                    let meterTypeDoc = WB_MeterType.findOne({_id: customer.meterTypeId});
                                    maintenance = GeneralFunction.roundKhmerCurrency(meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                                    // maintenance = GeneralFunction.roundKhmerCurrency(row.meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                                }
                                let contribution = waterConsumption * contributionFeePrice;
                                let selector = {
                                    level: level,
                                    newReading: row.newReading,
                                    expiredDate: moment(row.newReadingDate).add(25, 'days').toDate(),
                                    //expiredDate: row.expiredDate,
                                    waterConsumption: waterConsumption,
                                    price: price,
                                    //  modifyTime: row.modifyTime,
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
                                    // isEstimated: row.isEstimated,
                                    lastSynced: row.lastSynced || '',
                                    lastModified: row.lastModified || '',
                                    desc: row.desc,
                                    meterChangeDesc: row.meterChangeDesc,
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
                                let flagSelector = {
                                    $set: selector
                                };
                                if (isMobileSync) {
                                    flagSelector.$addToSet = {
                                        syncedBy: userId
                                    }
                                }
                                let query = {
                                    _id: row._id
                                };
                                if (!row.bypassPrinted) {//check if bypass has not been confirm by monitor and will update journal detail with flag print=false only
                                    query.printed = false;

                                }
                                let flagUpdate = WB_MeterReadingJournalDetail.update(query, flagSelector);
                                if (flagUpdate === 1) {
                                    //update postedCount even with description
                                    Meteor.call('description_findDescriptionAsObj', {value: row.desc}, (err, result) => {
                                        if (!err) {
                                            if (result && result.isPinned) {
                                                WB_Customer.direct.update({
                                                    _id: row.customerId
                                                }, {
                                                    $set: {
                                                        desc: row.desc,
                                                        avgWaterConsumption,
                                                        contractUpdated: false,
                                                        prevReading: row.newReading,
                                                        prevReadingDate: row.newReadingDate
                                                    }
                                                })
                                            } else {
                                                WB_Customer.direct.update({_id: row.customerId}, {
                                                    $set: {
                                                        avgWaterConsumption,
                                                        contractUpdated: false,
                                                        prevReading: row.newReading,
                                                        prevReadingDate: row.newReadingDate
                                                    },
                                                    $unset: {desc: ''}
                                                });
                                            }
                                        }
                                    });


                                } else {
                                    if (isMobileSync) {
                                        Meteor.call('requestUpdateJournalDetail_insert', userId, row.meterReadingId, row, (err, result) => {
                                            // console.log(err && err.message);
                                        });
                                    }
                                }
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
                            balance: maintenance + contribution + total,
                            lastSynced: row.lastSynced || '',
                            lastModified: row.lastModified,
                            desc: row.desc,
                            meterChangeDesc: row.meterChangeDesc
                        };
                        if (meterChangeHistory) {
                            selector.meterChangeHistory = meterChangeHistory;
                        }
                        let flagSelector = {
                            $set: selector
                        };
                        if (isMobileSync) {
                            flagSelector.$addToSet = {
                                syncedBy: userId
                            }
                        }
                        let query = {
                            _id: row._id
                        };
                        if (!row.bypassPrinted) {//check if bypass has not been confirm by monitor and will update journal detail with flag print=false only
                            query.printed = false;

                        }
                        let flagUpdate = WB_MeterReadingJournalDetail.update(query, flagSelector);
                        if (flagUpdate === 1) {
                            WB_Customer.direct.update({_id: row.customerId}, {
                                $set: {
                                    avgWaterConsumption,
                                    contractUpdated: false,
                                    prevReading: row.newReading,
                                    prevReadingDate: row.newReadingDate
                                },
                                $unset: {desc: ''}
                            }); //unset description when newReading is read
                        } else {
                            if (isMobileSync) {
                                Meteor.call('requestUpdateJournalDetail_insert', userId, row.meterReadingId, row, (err, result) => {
                                    console.log(err);
                                });
                            }
                        }
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
    }
    static getSumForUpload(waterConsumption, row, customerArr,jbId)
    {
        userId = userId || Meteor.userId();
        if (userId) {
            let customer = customerArr.find(x => x.streetNo === row.streetNo);
            let tariff = WB_Tariff.findOne({_id: customer.tariff});
            if (tariff) {
                let thisInvoice;
                if (tariff.typeId === '005') {
                    let meterChangeHistory;
                    let oldMeterWaterConsumption;
                    let newMeterWaterConsumption = waterConsumption;
                    //calculate with meter changed (have to check with modifiedDate

                    thisInvoice = WB_MeterReadingJournalDetail.findOne({streetNo: row.streetNo, meterReadingJournalId: jbId});
                    if (customer.contractUpdated || thisInvoice.hasOldMeterWaterConsumption) {
                        meterChangeHistory = WB_CustomerMeterChangeHistory.findOne({_id: customer.meterChangeHistoryId}, {sort: {modifiedDate: -1}});
                        oldMeterWaterConsumption = meterChangeHistory.newContract.remainWaterConsumption;
                        if (meterChangeHistory.newContract.type !== 'Edit') {
                            waterConsumption += oldMeterWaterConsumption;
                        }
                    }
                    //let billingCycle = row.customerDoc.billingCycle; "In getTariff function"
                    let billingCycle = customer.billingCycle;
                    let tariffObj = tariff.rangePrice.find(x => (x.startRange * billingCycle <= waterConsumption, x.endRange * billingCycle >= waterConsumption));
                    if (tariffObj && tariffObj.price) {
                        let price = tariffObj.price;
                        let level = tariffObj.level;
                        let total = waterConsumption * price;
                        let contributionFeePrice = tariff.contributionFeePrice;
                        Meteor.defer(function () {
                                let journalDetails3monthsHistory = WB_MeterReadingJournalDetail.find({
                                    _id: {$ne: thisInvoice._id},
                                    customerId: customer._id
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
                                    let meterTypeDoc = WB_MeterType.findOne({_id: customer.meterTypeId});
                                    maintenance = GeneralFunction.roundKhmerCurrency(meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                                    // maintenance = GeneralFunction.roundKhmerCurrency(row.meterTypeDoc.diameter * tariff.maintenance) * billingCycle;
                                }
                                let contribution = waterConsumption * contributionFeePrice;
                                let selector = {
                                    level: level,
                                    newReading: row.newReading,
                                    expiredDate: moment(row.newReadingDate).add(25, 'days').toDate(),
                                    //expiredDate: row.expiredDate,
                                    waterConsumption: waterConsumption,
                                    price: price,
                                    //  modifyTime: row.modifyTime,
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
                                    // isEstimated: row.isEstimated,
                                    lastSynced: row.lastSynced || '',
                                    lastModified: row.lastModified || '',
                                    desc: row.desc,
                                    meterChangeDesc: row.meterChangeDesc,
                                };
                                //add sumbarcode to meter reading journal detail
                                if(row.sumBarcode){
                                    selector.sumBarcode = row.sumBarcode;
                                }

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
                                let flagSelector = {
                                    $set: selector
                                };
                                if (isMobileSync) {
                                    flagSelector.$addToSet = {
                                        syncedBy: userId
                                    }
                                }
                                let query = {
                                    streetNo: row.streetNo,
                                    meterReadingJournalId: jbId
                                };
                                if (!row.bypassPrinted) {//check if bypass has not been confirm by monitor and will update journal detail with flag print=false only
                                    query.printed = false;

                                }
                                let flagUpdate = WB_MeterReadingJournalDetail.update(query, flagSelector);
                                if (flagUpdate === 1) {
                                    //update postedCount even with description
                                    Meteor.call('description_findDescriptionAsObj', {value: row.desc}, (err, result) => {
                                        if (!err) {
                                            if (result && result.isPinned) {
                                                WB_Customer.direct.update({
                                                    _id: customer._id
                                                }, {
                                                    $set: {
                                                        desc: row.desc,
                                                        avgWaterConsumption,
                                                        contractUpdated: false,
                                                        prevReading: row.newReading,
                                                        prevReadingDate: row.newReadingDate
                                                    }
                                                })
                                            } else {
                                                WB_Customer.direct.update({_id: customer._id}, {
                                                    $set: {
                                                        avgWaterConsumption,
                                                        contractUpdated: false,
                                                        prevReading: row.newReading,
                                                        prevReadingDate: row.newReadingDate
                                                    },
                                                    $unset: {desc: ''}
                                                });
                                            }
                                        }
                                    });


                                } else {
                                    if (isMobileSync) {
                                        Meteor.call('requestUpdateJournalDetail_insert', userId, row.meterReadingId, row, (err, result) => {
                                            // console.log(err && err.message);
                                        });
                                    }
                                }
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
                        let customer = WB_Customer.findOne({streetNo: row.streetNo});
                        if (customer.contractUpdated) {
                            meterChangeHistory = WB_CustomerMeterChangeHistory.findOne({_id: customer.meterChangeHistoryId});
                        }
                        let journalDetails3monthsHistory = WB_MeterReadingJournalDetail.find({
                            _id: {$ne: thisInvoice._id},
                            customerId: customer.customerId
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
                            balance: maintenance + contribution + total,
                            lastSynced: row.lastSynced || '',
                            lastModified: row.lastModified,
                            desc: row.desc,
                            meterChangeDesc: row.meterChangeDesc
                        };
                        //add sumbarcode to meter reading journal detail
                        if(row.sumBarcode){
                            selector.sumBarcode = row.sumBarcode;
                        }
                        if (meterChangeHistory) {
                            selector.meterChangeHistory = meterChangeHistory;
                        }
                        let flagSelector = {
                            $set: selector
                        };
                        if (isMobileSync) {
                            flagSelector.$addToSet = {
                                syncedBy: userId
                            }
                        }
                        let query = {
                            streetNo: row.streetNo,
                            meterReadingJournalId: jbId
                        };
                        if (!row.bypassPrinted) {//check if bypass has not been confirm by monitor and will update journal detail with flag print=false only
                            query.printed = false;

                        }
                        let flagUpdate = WB_MeterReadingJournalDetail.update(query, flagSelector);
                        if (flagUpdate === 1) {
                            WB_Customer.direct.update({_id: customer._id}, {
                                $set: {
                                    avgWaterConsumption,
                                    contractUpdated: false,
                                    prevReading: row.newReading,
                                    prevReadingDate: row.newReadingDate
                                },
                                $unset: {desc: ''}
                            }); //unset description when newReading is read
                        } else {
                            if (isMobileSync) {
                                Meteor.call('requestUpdateJournalDetail_insert', userId, row.meterReadingId, row, (err, result) => {
                                    console.log(err);
                                });
                            }
                        }
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
    }
}