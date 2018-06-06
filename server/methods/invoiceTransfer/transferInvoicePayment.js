import {Meteor} from 'meteor/meteor';
import {Wb_meterReadingJournal, WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal';
import {WB_Payment} from '../../../imports/collection/payment';
import ValidateUser from '../../../both/validateMethods/validate-user';

Meteor.methods({
    transferInvoicePayment(form,data) {
        ValidateUser.ifUserNotSignedIn({msg: 'Must login to add reading journal'});
        data.forEach(function (payment) {
            WB_Payment.direct.update({_id:payment._id},{$set:{
                createdBy:form.userCashier,
                date:form.date,
                dateFormatted:moment(form.date).format('YYYY-MM-DD'),
                transferBy:payment.createdBy
            }})
        });
    }
});