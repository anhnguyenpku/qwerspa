import {RefModify} from '../../collection/refModify';
import Aggr from './aggregation';

export default class RefModifyFunc {
    static insertDoc(doc) {
        RefModify.insert(doc);
    }

    static giveMeRefModifyArrayObject(selector) {
        return RefModify.aggregate([
            {
                $match: selector
            },
            {
                $lookup: Aggr.lookup('users','modifiedBy','_id','userDoc')
            },
            {
                $lookup: Aggr.lookup('wb_customer', 'document.customerId', '_id', 'document.customerDoc')
            },
            {
                $unwind: Aggr.unwind('$userDoc')
            },
            {
                $unwind: Aggr.unwind('$document.customerDoc')
            }
        ])
    }
}