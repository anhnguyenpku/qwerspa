import {WB_MeterType} from '../../../imports/collection/meterType';
Meteor.methods({
    findMeterType(){
        let meterTypes = WB_MeterType.find({}, {limit: 50, sort: {_id: -1}});
        return meterTypes.fetch();
    },
    removeMeterType(id){
        if(Meteor.userId()) {
            return WB_MeterType.remove(id);
        }
    }
});