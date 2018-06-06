import ValidateUser from "../../both/validateMethods/validate-user";
import {CheckRoles} from "../../imports/api/methods/checkRoles";
import {WB_waterBillingSetup} from '../../imports/collection/waterBillingSetup';
Meteor.methods({
    insertWaterBillingSetup({data}){
        ValidateUser.ifUserNotSignedIn({msg: 'Must be login in order to insert water billing setup'});
        if (CheckRoles({roles: ['setting', 'super']})) {
            return WB_waterBillingSetup.insert(data);
        }
    },
    updateWaterBillingSetup({_id,data}){
        ValidateUser.ifUserNotSignedIn({msg: 'Must be login in order to insert water billing setup'});
        if (CheckRoles({roles: ['setting', 'super']})) {
            return WB_waterBillingSetup.update({_id},{$set: data});
        }
    },
    fetchWaterBillingSetup(){
        return WB_waterBillingSetup.find({}).fetch();
    }
});