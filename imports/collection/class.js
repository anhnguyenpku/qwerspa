/**
 * Created by snr on 1/15/17.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

import {WB_Category} from '../../imports/collection/category';

export const WB_Class = new Mongo.Collection("wb_class");
export const VW_Class = new Mongo.Collection("vw_class");

WB_Class.schema = new SimpleSchema({

    code: {
        type: String,
        label: "Code"
    },
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description"
    },
    categoryId: {
        type: String,
        autoform: {
            type: 'select2',
            options(){
                let list = [];
                list.push({label: '(Select One)', value: ''});
                WB_Category.find({}).forEach(function (cat) {
                    list.push({label: cat.name, value: cat._id});
                });
                return list;
            }
        }
    }

});
/**
 * Attach schema
 */

Meteor.startup(function () {
    WB_Class.attachSchema(WB_Class.schema);
});


