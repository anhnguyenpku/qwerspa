import { WB_SavingDetail, WB_Saving } from '../../collection/saving';
import { WB_Payment } from '../../collection/payment';
export default class Saving {
    static insert({ doc }) {
        if (!doc) {
            throw new Meteor.Error('Doc must be must be an object');
        }
        let saving = WB_Saving.findOne({ customerId: doc.customerId });
        let savingId = '';
        if (!saving) {
            savingId = WB_Saving.insert({ balance: 0, customerId: doc.customerId, rolesArea: doc.rolesArea });
        } else {
            savingId = saving._id;
        }
        Saving.insertSavingDetail({ doc, savingId });
    }

    static insertSavingDetail({ doc, savingId }) {
        // checkif saving detail already exist with refId'
        if (!doc || !savingId) {
            throw new Meteor.Error('Doc must  be an object and Saving Id must be a string');
        }
        doc.savingId = savingId;
        let saleDetail = WB_SavingDetail.findOne({ _id: doc._id });
        if (saleDetail) {
            WB_SavingDetail.update({ _id: doc._id }, { $set: { amount: doc.amount } })
        } else {
            WB_SavingDetail.insert(doc);
        }
    }

    static updateSavingBalance({ savingId, amount }) {
        if (!amount || !savingId) {
            throw new Meteor.Error('Amount must  be a number and Saving Id must be a string');

        }
        WB_Saving.update({ _id: savingId }, { $inc: { balance: amount } });
    }

    static editSavingBalance({ savingId, oldAmount, amount }) {
        if (!savingId || !oldAmount || !amount) {
            throw new Meteor.Error('Amount and Old Amount must be a number and Saving Id must be a string');
        }
        let saving = WB_Saving.findOne({ _id: savingId });
        let currentAmount = saving.balance + ((-1) * oldAmount);
        currentAmount = currentAmount < 0 ? 0 : currentAmount;
        Saving.updateSavingBalance({ savingId, amount: currentAmount });
    }

    static giveMeSavingDetailAsArrayObject(selector) {
        return WB_SavingDetail.find(selector).fetch();
    }
    static removingSaleDetail(selector){
        return WB_SavingDetail.remove(selector);
    }
    static giveMeSavingObject(selector) {
        return WB_Saving.findOne(selector);
    }
    static checkIfSavingDetailHasRelation(selector) {
        return WB_Payment.find(selector).fetch();
    }
    static removeSavingDetailObj(selector){
        return WB_SavingDetail.remove(selector)
    }

};
