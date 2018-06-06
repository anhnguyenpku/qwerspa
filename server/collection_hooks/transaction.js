import {Transaction, TransactionDetail} from '../../imports/collection/transaction';
import Trans from '../../imports/api/methods/transaction';
TransactionDetail.after.insert((userId, doc) => {
    Trans.updateTransactionBalance({transId: doc.transId, amount: doc.amount});
});

TransactionDetail.after.update(function (userId, doc) {
    let prevDoc = this.previous;
    Meteor.defer(function () {
        let trans = Transaction.findOne({customerId: doc.customerId});
        let minusOldAmount = trans.balance + (prevDoc.amount * (-1));
        if (minusOldAmount < 0) { //if balance < 0 set it to 0
            minusOldAmount = 0;
        }
        Transaction.update({_id: trans._id}, {$set: {balance: minusOldAmount + doc.amount}});
    })
});

TransactionDetail.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        Transaction.update(
            {_id: doc.transId},
            {
                $inc: {
                    balance: (doc.amount * (-1))
                }
            }
        );
    })
});