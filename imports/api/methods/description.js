import {Description} from '../../collection/description';

class DescriptionModel {
    insert(doc, docId) {
        if(!docId) {
            return Description.insert(doc);
        }
        return Description.update({_id: docId}, {$set: doc});
    }
    fetch(selector={}){
        return Description.find({}).fetch();
    }
    remove(_id){
        return Description.remove({_id});
    }
    findOne(selector={}){
        return Description.findOne(selector)
    }

}

export default new DescriptionModel();