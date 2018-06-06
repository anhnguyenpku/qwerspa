import {WB_RequestUpdateJournalDetail} from '../../collection/requestUpdateJournalDetail';

class RequestUpdateJournalDetailModel {
    insert(userId, meterReadingId, doc) {
        return WB_RequestUpdateJournalDetail.insert({
            status: 'pending',
            requestDate: doc && doc.lastSynced,
            requestBy: userId,
            meterReadingId,
            doc: doc
        });
    }
    update(_id,selector){
        return WB_RequestUpdateJournalDetail.update({_id: _id}, selector);
    }



}

export default new RequestUpdateJournalDetailModel();