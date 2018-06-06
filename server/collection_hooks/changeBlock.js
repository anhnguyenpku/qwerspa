import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_ChangeBlock} from '../../imports/collection/changeBlock';
import {WB_Customer} from '../../imports/collection/customer';

WB_ChangeBlock.before.insert(function (userId, doc) {

    let prefix = moment().format("YYMM");
    doc._id = GeneralFunction.generatePrefixId(WB_ChangeBlock, prefix, 5);
});


WB_ChangeBlock.after.insert(function (userId, doc) {
    let customerDoc = WB_Customer.findOne({_id: doc.customerId});
    let newChangeBlock = [];
    if (customerDoc.changeBlock) {
        customerDoc.changeBlock.forEach(function (obj) {
            if (obj.endDate == undefined || obj.endDate == "") {
                obj.endDate = doc.changeDate;
            }
            newChangeBlock.push(obj);
        })
    }
    newChangeBlock.push(doc);

    WB_Customer.direct.update({_id: doc.customerId}, {
        $set: {
            changeBlock: newChangeBlock,

            district: doc.newDistrict,
            quartier: doc.newQuartier,
            block: doc.newBlock,
            folio: doc.newFolio,
            successor: doc.newSuccessor,
            streetNo: doc.newStreet,
            dpc: doc.newDPC

        }
    })

})

WB_ChangeBlock.after.remove(function (userId, doc) {
    let customerDoc = WB_Customer.findOne({_id: doc.customerId});
    let newChangeBlock = [];
    if (customerDoc.changeBlock) {
        customerDoc.changeBlock.forEach(function (obj) {
            if (obj._id != doc._id) {
                if (obj.endDate && obj.endDate.getTime() == doc.changeDate.getTime()) {
                    obj.endDate = "";
                }
                newChangeBlock.push(obj);
            }
        })
    }
    WB_Customer.direct.update({_id: doc.customerId}, {
        $set: {
            changeBlock: newChangeBlock,

            district: doc.customerDistrict,
            quartier: doc.customerQuartier,
            block: doc.customerBlock,
            folio: doc.customerFolio,
            successor: doc.customerSuccessor,
            streetNo: doc.customerStreet,
            dpc: doc.customerDPC
        }
    })
})

