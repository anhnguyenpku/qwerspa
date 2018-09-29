import {Pos_Location} from '../../imports/collection/posLocation';


Meteor.startup(function () {
    if (Pos_Location.find().count() == 0) {
        let us = Meteor.users.findOne({username: "super"});
        const rawLocation = Pos_Location.rawCollection();
        rawLocation.insert({
            _id: "001", name: "ទូទៅ", code: "001", isMainLocation: true,
            createdUser: us._id
        });
    }

});
