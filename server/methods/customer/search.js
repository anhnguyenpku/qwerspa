import {WB_Customer} from '../../../imports/collection/customer';

Meteor.methods({
    lookupCustomer(q){
        if (q == '') {
            return [];
        }
        let reg = new RegExp(q, 'i');
        return WB_Customer.find({
            $or: [
                {name: {$regex: reg}},
                {khName: {$regex: reg}}
            ]
        },{limit: 50}).fetch();
    }
});