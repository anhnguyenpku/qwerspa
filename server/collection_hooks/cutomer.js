import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_Customer} from '../../imports/collection/customer';
import {WB_District} from '../../imports/collection/district';
import {WB_Quartier} from '../../imports/collection/quartier';
import {WB_Block} from '../../imports/collection/block';
import {WB_Province} from '../../imports/collection/province';
import {WB_MeterReadingJournalDetail} from '../../imports/collection/meterReadingJournal';

WB_Customer.before.insert(function (userId, doc) {
    let substrArea = doc.rolesArea && doc.rolesArea.substr(0, 2) || '';
    let province = WB_Province.findOne({code: substrArea});
    doc._id = GeneralFunction.generatePrefixIdWithCounter('customer', doc.rolesArea, province && province.enShortName || '' , 6);
    doc.newCustomerId = doc._id;
    if (doc.contract && doc.contract.prevReadingDate) {
        doc.prevReadingDate = doc.contract.prevReadingDate;
    }
});

WB_Customer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        Meteor._sleepForMs(250);
        let dpc = generateDpc(doc);
        doc.dpc=dpc;
        let changeBlock=getChangeBlock(doc);

        WB_Customer.direct.update(doc._id, {$set: {dpc: dpc,changeBlock: changeBlock}});
        if (doc.contract) {
            let setObj = {
                prevReading: doc.contract.prevReading || 0,
            };
            WB_Customer.direct.update({_id: doc._id}, {$set: setObj});
        }
    });
});
WB_Customer.after.update(function (userId, doc) {
    Meteor.defer(function () {
        let dpc = generateDpc(doc);
        doc.dpc=dpc;
        let changeBlock=getChangeBlock(doc);
        if(doc.changeBlock && doc.changeBlock.length>0){
            doc.changeBlock.forEach(function (obj) {
                if(obj.changeDate){
                    changeBlock.push(obj);
                }
            })
        }

        WB_Customer.direct.update(doc._id, {$set: {dpc: dpc,changeBlock:changeBlock}});
        let mrjd = WB_MeterReadingJournalDetail.findOne({customerId: doc._id});
        if(!mrjd){
            if (doc.contract) {
                let setObj = {
                    prevReading: doc.contract.prevReading || 0,
                    prevReadingDate: doc.contract.prevReadingDate
                };
                WB_Customer.direct.update({_id: doc._id}, {$set: setObj});
            }
        }

    });
});

function generateDpc(doc) {
    let district = WB_District.findOne({_id: doc.district});
    let quartier = WB_Quartier.findOne({_id: doc.quartier});
    let block = WB_Block.findOne({_id: doc.block});
    return district.code + quartier.code + block.code + doc.folio + doc.successor;
}

function getChangeBlock(doc) {
    let changeBlock=[];
    let changeBlockDoc={};
    changeBlockDoc.customerId=doc._id;
    changeBlockDoc.customerDPC=doc.dpc;
    changeBlockDoc.customerQuartier=doc.quartier;
    changeBlockDoc.customerBlock=doc.block;
    changeBlockDoc.customerDistrict=doc.district;
    changeBlockDoc.customerFolio=doc.folio;
    changeBlockDoc.customerSuccessor=doc.successor;
    changeBlockDoc.customerStreet=doc.streetNo;

    changeBlockDoc.newDPC=doc.dpc;
    changeBlockDoc.newQuartier=doc.quartier;
    changeBlockDoc.newBlock=doc.block;
    changeBlockDoc.newDistrict=doc.district;
    changeBlockDoc.newFolio=doc.folio;
    changeBlockDoc.newSuccessor=doc.successor;
    changeBlockDoc.newStreet=doc.streetNo;

    changeBlockDoc.rolesArea=doc.rolesArea;

    changeBlock.push(changeBlockDoc);
    return changeBlock;
}