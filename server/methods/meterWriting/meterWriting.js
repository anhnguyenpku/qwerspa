import {Meteor} from 'meteor/meteor';
import {WB_Tariff} from '../../../imports/collection/tariff.js';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal';
Meteor.methods({
    fetchSettingPriceByCategory(id, categoryId, waterConsumption, newReading){
        if (Meteor.userId()) {
            let tariff = WB_Tariff.findOne({categoryId: categoryId});
            return tariff;
            if (true) {
                let tariffObj = tariff.rangePrice.find(x => (x.startRange <= waterConsumption, x.endRange >= waterConsumption));
                let price = tariff.price;
                WB_MeterReadingJournalDetail.update({_id: id},
                    {
                        $set: {
                            newReading: newReading,
                            waterConsumption: waterConsumption,
                            price: price,
                            total: waterConsumption * price,
                            contributionFee: waterConsumption,
                            written: true,
                            maintenanceFee:tariff.maintenance
                        }
                    })
            }
            else {
                let total=0;
                let pricingList=[];
                //Make sure that range price sorted
                tariff.forEach(function (rp) {
                    let remainQty=waterConsumption;
                    let qty=waterConsumption-rp.endRange;
                    if(waterConsumption-rp.startRange>0) {
                        if (qty > 0) {
                            let usingQty = rp.endRange - rp.startRange;
                            let amount = rp.price * usingQty;
                            pricingList.push({
                                price: rp.price,
                                qty: usingQty,
                                amount: amount
                            });
                            total += amount;
                        } else {
                            let usingQty = waterConsumption - rp.startRange;
                            let amount = rp.price * usingQty;
                            pricingList.push({
                                price: rp.price,
                                qty: usingQty,
                                amount: amount
                            });
                            total += amount;
                        }
                    }
                });
               // let tariffObj = tariff.rangePrice.find(x => (x.startRange <= waterConsumption, x.endRange >= waterConsumption));
                let price = tariff.price;
                WB_MeterReadingJournalDetail.update({_id: id},
                    {
                        $set: {
                            newReading: newReading,
                            waterConsumption: waterConsumption,
                            price: price,
                            total: waterConsumption * price,
                            contributionFee: waterConsumption,
                            written: true,
                            maintenanceFee:tariff.maintenance
                        }
                    })
            }
        }
        return true;
    }
});