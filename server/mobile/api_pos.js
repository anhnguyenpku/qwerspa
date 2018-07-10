import {Meteor} from 'meteor/meteor';
import {Pos_Product} from "../../imports/collection/posProduct";

Meteor.methods({
    api_fetchProduct({name, color}) {
        //let user = Meteor.users.findOne({_id: userId});
        console.log("Call  Api");
        // return Pos_Product.find().fetch();
            return "ការសិក្សា"
    }
});