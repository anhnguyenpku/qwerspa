import {Pos_Vendor} from '../../imports/collection/posVendor';


Meteor.startup(function () {
    if (Pos_Vendor.find().count() == 0) {
        let us = Meteor.users.findOne({username: "super"});
        const rawVendor = Pos_Vendor.rawCollection();
        rawVendor.insert({
            _id: "001", name: "ទូទៅ", khName: "ទូទៅ", address: "general@gmail.com", termId: "001",
            createdUser: us._id
        });
    }

});
