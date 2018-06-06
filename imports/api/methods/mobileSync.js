import {WB_MobileSync} from '../../collection/mobileSync';

export default class MobileSync {
    static insert(doc) {
        return WB_MobileSync.insert(doc);
    }
    static update(_id,selector){
        return WB_MobileSync.update({_id}, selector);
    }
}
