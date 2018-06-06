import XLSX from 'xlsx';
import {WB_Customer} from "../../imports/collection/customer";
import {WB_MeterType} from "../../imports/collection/meterType";
import {WB_District} from "../../imports/collection/district";
import {WB_Quartier} from "../../imports/collection/quartier";
import {WB_Block} from "../../imports/collection/block";
import {Wb_activity} from "../../imports/collection/activity";
import {WB_Category} from "../../imports/collection/category";
import {WB_Tariff} from "../../imports/collection/tariff";
import UploadJBD from '../../imports/api/methods/upload';
import {WB_MeterReadingJournalDetail} from "../../imports/collection/meterReadingJournal";

Meteor.methods({
    upload: (bstr, name) => {
        /* read the data and return the workbook object to the frontend */
        let workbook = XLSX.read(bstr, {type: 'binary'});
        let sheet_name_list = workbook.SheetNames;
        let count = 0;
        let meterType = WB_MeterType.findOne({});
        let activity = Wb_activity.findOne({});
        let category = WB_Category.findOne({});
        let tariff = WB_Tariff.findOne({});
        for (let i = 0; i < sheet_name_list.length; i++) {
            let customers = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
            let meterType = WB_MeterType.findOne({});
            let defaultData = {
                rolesArea: '0203',
                contract: {
                    contractDate: moment().toDate(),
                    familyHeadCount: 0,
                    tableOrRoom: 0,
                    meterInstallDate: moment().toDate(),
                    prevReadingDate: moment().toDate(),
                    prevReading: 0,
                    meterTypeId: meterType ? meterType._id : '0'

                }
            };
            customers.forEach(function (customer) {
                if (customer.sumId) {
                    const query = {
                        streetNo: customer.streetNo
                    };
                    const selector = {
                        $set: {sumId: customer.sumId}
                    };
                    WB_Customer.direct.update(query, selector)
                } else {
                    customer._id = customer.newCustomerId;
                    customer.meterReference = [];
                    customer.contract = defaultData.contract;
                    customer.contract.contractDate = moment(customer.contract).toDate();
                    customer.contract.meterInstallDate = moment(customer.contract).toDate();
                    customer.contract.prevReadingDate = moment(customer.prevReadingDate).toDate();
                    customer.contract.prevReading = customer.prevReading;
                    customer.contract.meterDiameter = meterType._id;
                    customer.rolesArea = defaultData.rolesArea;
                    customer.district = WB_District.findOne({code: customer.district})._id;
                    customer.quartier = WB_Quartier.findOne({code: customer.quarter})._id;
                    customer.successor = customer.success;
                    customer.block = WB_Block.findOne({code: customer.block})._id;
                    customer.activity = activity._id;
                    customer.position = 'active';
                    customer.billingCycle = 1;
                    customer.dpc = customer.DPC;
                    customer.tariff = '020300' + customer.tariff;
                    customer.category = '00' + customer.category;
                    WB_Customer.direct.insert(customer);
                }

                // CustomerTest.insert(customer);
                count++;
            });
        }
        console.log(count);
        return 'finsihed';
    },
    uploadNewReading: (bstr, name, readingDate, jbId) => {
        /* read the data and return the workbook object to the frontend */
        let workbook = XLSX.read(bstr, {type: 'binary'});
        let sheet_name_list = workbook.SheetNames;
        let count = 0;
        for (let i = 0; i < sheet_name_list.length; i++) {
            let customers = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
            let count = 0;
            let mapCustomers = customers.map(o => o.sumId ? o.sumId : o.customerId);
            let selector = {_id: {$in: mapCustomers}};
            if (customers[0].sumId) {
                selector = {sumId: {$in: mapCustomers}};
            }
            let customersArr = WB_Customer.find(selector).fetch();
            customers.forEach(function (customer) {
                let waterConsumption = 0;
                if (!customer.sumBarcode) {
                    customer.newReading = parseInt(customer.newReading);
                    customer.prevReading = parseInt(customer.prevReading);
                    customer.newReadingDate = moment(readingDate + " 11:00:00").toDate();
                    customer.prevReadingDate = moment(customer.prevReadingDate).toDate();
                    waterConsumption = customer.newReading - customer.prevReading;
                }
                if (waterConsumption >= 0 && !customer.desc) {
                    if (customer.sumBarcode) {
                        const customerObj = customersArr.find(o => o.sumId === customer.sumId);
                        // UploadJBD.getSumForUpload(waterConsumption, customer, customersArr, jbId)
                        if (customerObj) {
                            WB_MeterReadingJournalDetail.direct.update({
                                streetNo: customerObj.streetNo,
                                meterReadingJournalId: jbId
                            }, {$set: {sumBarcode: customer.sumBarcode}});
                        }
                    } else {
                        UploadJBD.getTariffForUpload(waterConsumption, customer, customersArr);
                    }
                } else if (!!customer.desc) {
                    WB_MeterReadingJournalDetail.direct.update({
                            meterReadingJournalId: jbId,
                            streetNo: customer.streetNo
                        },
                        {
                            $set: {desc: customer.desc}
                        });
                }
                count++;
            });
        }
        return 'finsihed';
    }
});

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function switchTariff(val) {
    let tariff;
    switch (val) {
        case '1':
            tariff = '0203001';
            break;
        case '2':
            tariff = '0203002';
            break;
        case '3':
            tariff = '0203003';
            break;
        case '4':
            tariff = '0203004';
            break;
    }
    return tariff;
}

