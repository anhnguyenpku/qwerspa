import RefModifyFunc from '../../../imports/api/methods/refModify';


Meteor.methods({
    insertRefModify(doc){
        RefModifyFunc.insertDoc(doc);
    },
    giveMeRefModifyArrayObject(selector){
        return RefModifyFunc.giveMeRefModifyArrayObject(selector);
    }
});