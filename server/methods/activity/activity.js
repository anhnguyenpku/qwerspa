import {Meteor} from 'meteor/meteor';
import {Wb_activity} from '../../../imports/collection/activity';
Meteor.methods({
    addNewActivity({activity}) {
        if (!this.userId) {
            throw new Meteor.Error('You not login',
                'Must be logged in to make add activity setting!');
        }
        let id = Wb_activity.insert(activity, function (err) {
            if (err) {
                return;
            }
        });
        return id;
    },
    removeActivity({_id}){
        Wb_activity.remove({_id: _id});
    },
    updateActivity({activity}) {
        if (!this.userId) {
            throw new Meteor.Error('You not login',
                'Must be logged in to edit activity setting!');
        }

        return Wb_activity.update(activity._id, {$set: {code: activity.code, name: activity.name}});
    },
    fetchActivity(selector){
        Meteor._sleepForMs(200);
        return Wb_activity.findOne(selector);
    },
    fetchActivityData(){
        let activities = Wb_activity.find({});
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        activities.forEach(function (activity) {
            list.push({label: `${activity.code} | ${activity.name}`, value: activity._id});
        });
        return list;
    }
});