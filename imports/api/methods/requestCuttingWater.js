import {WB_RequestCuttingWater} from '../../collection/requestCuttingWater';
import {WB_MeterReadingJournalDetail} from '../../collection/meterReadingJournal';

class RequestCuttingWater {
    insert(doc) {
        let id = WB_RequestCuttingWater.insert(doc);
        if (id) {
            WB_MeterReadingJournalDetail.direct.update({_id: doc.journalBookDetailId}, {$set: {requestCuttingWaterId: id}});
        }
    }

    remove(_id) {
        if (_id) {
            WB_RequestCuttingWater.remove({_id});
        }
    }

    totalOverdue(rolesArea, pipeline) {
        if (!!rolesArea) {
            pipeline = pipeline && pipeline.length > 0 ? pipeline : [
                {$match: {rolesArea: rolesArea, status: 'active', paidAt: {$exists: false}}},
                {
                    $lookup: {
                        from: 'wb_meterReadingJournalDetails',
                        localField: 'journalBookDetailId',
                        foreignField: '_id',
                        as: 'journalDetailBookDoc'
                    }
                },
                {
                    $unwind: {
                        path: '$journalDetailBookDoc',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOverdue: {$sum: '$journalDetailBookDoc.grandTotal'}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalOverdue: 1
                    }
                }
            ];
            return WB_RequestCuttingWater.aggregate(pipeline);
        }
        return []
    }
}

export default new RequestCuttingWater();