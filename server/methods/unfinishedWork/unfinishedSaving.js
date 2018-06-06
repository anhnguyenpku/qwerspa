import {unfinishedSaving} from '../../../imports/collection/unfinshed-work';

Meteor.methods({
    giveMeUnfinishedSavingAsArrayObj(selector){
        return unfinishedSaving.find(selector).fetch();
    },
    removeUnfinishedSaving(selector){
        unfinishedSaving.remove(selector)
    }
});
