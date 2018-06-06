import {Meteor} from 'meteor/meteor';
import {WB_Customer} from '../../../imports/collection/customer'

Meteor.methods({
    wp_fetchCustomer(){
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            WB_Customer.find({}).fetch().forEach(function (obj) {
                list.push({label: obj.block + " : " + obj.khName + " | " + obj.dpc, value: obj._id});
            });
        }
        return list;
    },
    wp_fetchCustomerByBlock(blockId){
        let selector = {};
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (blockId) {
            selector.block = blockId;
            if (Meteor.userId()) {
                WB_Customer.find(selector).fetch().forEach(function (obj) {
                    list.push({label: obj.block + " : " + obj.khName + " | " + obj.dpc, value: obj._id});
                });
            }
        }
        return list;
    }
});