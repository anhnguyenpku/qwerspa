import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_ChartAccount} from "../../imports/collection/accChartAccount";

Meteor.publish('acc_chartAccountCount', function (rolesArea) {
    if (this.userId) {
        let subscription = this;

        let chartAccountCount = Acc_ChartAccount.find({}).count();
        let countObject = {};
        countObject.counts = chartAccountCount;
        countObject.type = "Acc_ChartAccount";
        countObject.rolesArea = rolesArea;
        console.log(countObject);
        subscription.added("countsRow", Random.id(), countObject);
        subscription.ready();
    }
    return this.ready();

});
