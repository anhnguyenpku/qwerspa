import {Pos_Term} from '../../imports/collection/posTerm';
import {Accounts} from "meteor/accounts-base";

Meteor.startup(function () {
    if (Pos_Term.find().count() == 0) {
        let us = Meteor.users.findOne({username: "super"});
        const rawTerm = Pos_Term.rawCollection();
        rawTerm.insert({
            _id: "001", name: "No Term", dueMethod: "Due in fixed number of days", days: 30, isDiscount: false,
            createdUser: us._id
        });
    }

});
