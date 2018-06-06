import DescriptionModel from '../../../imports/api/methods/description';


Meteor.methods({
    description_insert(doc,docId) {
        return DescriptionModel.insert(doc, docId);
    },
    description_fetchDescription(selector={}) {
        return DescriptionModel.fetch(selector);
    },
    description_removeDescription(_id) {
        return DescriptionModel.remove(_id)
    },
    description_findDescriptionAsObj(selector={}) {
        return DescriptionModel.findOne(selector)
    }
});