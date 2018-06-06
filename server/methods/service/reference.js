import {Meteor} from 'meteor/meteor';
import {WB_Reference} from '../../../imports/collection/reference'

Meteor.methods({
    wp_fetchType(){
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            WB_Reference.find({referenceTypeId: "001"}).fetch().forEach(function (obj) {
                list.push({label: obj._id + " : " + obj.name, value: obj._id});
            });
        }
        return list;
    },
    wp_fetchMeasure(){
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            WB_Reference.find({referenceTypeId: "002"}).fetch().forEach(function (obj) {
                list.push({label: obj._id + " : " + obj.name, value: obj._id});
            });
        }
        return list;
    },
    wp_fetchFloorBy(){
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            WB_Reference.find({referenceTypeId: "003"}).fetch().forEach(function (obj) {
                list.push({label: obj._id + " : " + obj.name, value: obj._id});
            });
        }
        return list;
    }
});