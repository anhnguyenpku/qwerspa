import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_PromotionReact} from "../../imports/collection/schPromotion";

Meteor.publish('Sch_PromotionReact', function () {
    if (this.userId) {
        return Sch_PromotionReact.find({});
    }
    return this.ready();

});
