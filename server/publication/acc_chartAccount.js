import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Acc_ChartAccountReact} from "../../imports/collection/accChartAccount";

Meteor.publish('acc_chartAccountReact', function () {
    if (this.userId) {
        return Acc_ChartAccountReact.find({});
    }
    return this.ready();

});
