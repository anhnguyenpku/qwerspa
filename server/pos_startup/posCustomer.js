import {Pos_Customer} from '../../imports/collection/posCustomer';


Meteor.startup(function () {
    if (Pos_Customer.find().count() == 0) {
        const rawCustomer= Pos_Customer.rawCollection();
        let us = Meteor.users.findOne({username: "super"});

        rawCustomer.insert({
            _id: "001",
            name: "ទូទៅ",
            khName: "ទូទៅ",
            address: "general@gmail.com",
            termId: "001",
            createdUser: us._id
        });
    }

});
