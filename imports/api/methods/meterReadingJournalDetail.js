import {WB_MeterReadingJournalDetail, Wb_meterReadingJournal} from '../../collection/meterReadingJournal';
import {WB_Payment} from '../../collection/payment';
import {RefModify} from '../../collection/refModify';
import Aggr from '../../api/methods/aggregation';

export default class MRJDFunc {
    static checkIfMeterReadingJournalDetailCanModify({_id, prevReadingDate, customerId, rolesArea}) {
        let payment = WB_Payment.findOne({meterJournalId: _id});
        if (payment) {
            throw new Meteor.Error('សូមធ្វើការលុបវិក័យប័ត្របង់ប្រាក់លេខ #' + payment.seqId + ' ជាមុនសិន!');
        } else {
            let meterReadingJournalDetail = WB_MeterReadingJournalDetail.aggregate([
                {
                    $match: {
                        $and: [
                            {_id: {$nin: [_id]}},
                            {_id: {$gt: _id}} //will re-consider remove this line after change counter collection
                        ],
                        prevReadingDate: {$gte: prevReadingDate},
                        customerId: customerId,
                        rolesArea: rolesArea,
                    }
                },
                {
                    $lookup: Aggr.lookup('wb_customer', 'customerId', '_id', 'customerDoc')
                },
                {
                    $lookup: Aggr.lookup('wb_meterReadingJournal', 'meterReadingJournalId', '_id', 'meterReadingJournalDoc')
                },
                {
                    $unwind: Aggr.unwind('$customerDoc')
                },
                {
                    $unwind: Aggr.unwind('$meterReadingJournalDoc')
                }
            ]);
            if (meterReadingJournalDetail.length > 0) {
                throw new Meteor.Error(`សូមធ្វើការលុបវិក័យប័ត្រអតិថិជន ${meterReadingJournalDetail[0].customerDoc.khName} ក្នុងសៀវភៅលេខ ${meterReadingJournalDetail[0].meterReadingJournalDoc.name} ជាមុនសិន!`);
            }
        }
        return true;
    }

    static removeMeterReadingJournalDetail(selector) {
        WB_MeterReadingJournalDetail.remove(selector);
    }

    static insertRefModify(doc) {
        let refModifyDoc = {
            type: doc.type,
            action: doc.action,
            modifiedDate: moment().toDate(),
            modifiedTime: doc.modifyTime,
            modifiedBy: doc.modifiedBy,
            document: doc
        };
        Meteor.call('insertRefModify', refModifyDoc);
    }
}