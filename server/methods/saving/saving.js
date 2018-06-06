import Saving from '../../../imports/api/methods/saving';
import ValidateUser from '../../../both/validateMethods/validate-user';

Meteor.methods({
    insertSaving({data}) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        Meteor._sleepForMs(200);
        data.forEach(function (doc) {
            Saving.insert({doc});
        });
        return;
    },
    giveMeSavingDetailAsArrayObject(selector) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        return Saving.giveMeSavingDetailAsArrayObject(selector);
    },
    giveMeSavingObject(selector) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        return Saving.giveMeSavingObject(selector);
    },
    giveMeSaveDetailEditAvailibility(selector, savingDetailIds) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        let rejected = [];
        let accepted = [];
        let savingDetailExistInPayment = Saving.checkIfSavingDetailHasRelation(selector);
        savingDetailIds.forEach(function (doc) {
            let savingObj = savingDetailExistInPayment.find(x => x.savingDetailId == doc._id)
            if (!savingObj) {
                accepted.push(doc._id);
            } else {
                rejected.push(savingObj);
            }
        });
        return {rejected, accepted}
    },
    removeSavingDetailObj({savingDetailData, customerId}){
        let savingObj = Saving.giveMeSavingObject({customerId});
        let sumAmount = 0;
        savingDetailData.forEach(function (o) {
            sumAmount += o.amont;
        });
        if (savingObj.balance == 0 || sumAmount > savingObj.balance) {
            throw new Meteor.Error("Your balance not enough for remove");
        }
        Saving.removeSavingDetailObj({_id: {$in: savingDetailData.map(o => o._id)}});
    }
});