import Saving from "../../imports/api/methods/saving";
import {WB_SavingDetail, WB_Saving} from '../../imports/collection/saving';

WB_SavingDetail.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        Saving.updateSavingBalance({savingId: doc.savingId, amount: doc.amount});
    });
});

WB_SavingDetail.after.update(function (userId, doc) {
    let oldDoc = this.previous;
    Meteor.defer(function () {
        Saving.editSavingBalance({savingId: doc.savingId, oldAmount: oldDoc.amount, amount: doc.amount});
    });
})

WB_SavingDetail.after.remove(function (userId, doc) {
    Saving.updateSavingBalance({savingId: doc.savingId, amount: ((-1) * doc.amount)});
});