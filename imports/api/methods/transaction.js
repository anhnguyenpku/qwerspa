import {Transaction, TransactionDetail} from '../../collection/transaction';
import {WB_waterBillingSetup} from '../../collection/waterBillingSetup';

export default class Trans {
    static insertTransaction({type, data, rolesArea, status}) {
        if (!type || !data) {
            throw new Meteor.Error('Type Must be a string and Data must be and object');
        }
        let transaction = Transaction.findOne({customerId: data.customerId});
        let transId = '';
        if (!transaction) {
            //first transaction insert
            transId = Transaction.insert({balance: 0, customerId: data.customerId, rolesArea});
        } else {
            transId = transaction._id;
        }
        Trans.insertTransactionDetail({type, data, transId, rolesArea, status});
    }

    static insertTransactionDetail({type, data, transId, rolesArea, status}) {
        // check if transaction detail already exist with refId
        let waterBilling = WB_waterBillingSetup.findOne({rolesArea});
        let transactionDetail = TransactionDetail.findOne({refId: data.refId});
        if (!transactionDetail) {
            let selector = {
                type,
                rolesArea,
                customerId: data.customerId,
                refId: data.refId,
                transId,
                status,
                amount: data.amount,
                date: data.date
            };
            //check if water consumption is zero and enable zer water consumption is enable
            if(data.waterConsumption === 0 && type === 'post' && (waterBilling && waterBilling.enableZeroWaterConsumption)){
                selector.amountIfEnableWaterConsumptionIsZero = data.amount;
                selector.amount = 0;
            }
            TransactionDetail.insert(selector);
        } else {
            let selector = {status: status, amount: data.amount, date: data.date};
            if(data.waterConsumption === 0 && type === 'post' && (waterBilling && waterBilling.enableZeroWaterConsumption)){
                selector.amountIfEnableWaterConsumptionIsZero = data.amount;
                selector.amount = 0;
            }
            TransactionDetail.update(
                {_id: transactionDetail._id},
                {$set: selector}
            );
        }

    }

    static updateTransactionBalance({transId, amount}) {
        if (!transId || amount == null) {
            throw new Meteor.Error('Type Must be a string and amount must be a number');
        }
        Transaction.update({_id: transId}, {$inc: {balance: amount}});
    }

    static directUpdateTransactionDetail(match, selector) {
        TransactionDetail.direct.update(match, selector);
    }

    static removeTransactionDetail({refId}) {
        TransactionDetail.remove({refId});
    }

    static giveMeTransactionObj(selector) {
        return Transaction.findOne(selector);
    }

    static giveMeTransactionDetailAsArrayObject(selector) {
        return TransactionDetail.find(selector).fetch();
    }
}