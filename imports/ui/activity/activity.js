/*
import {Vue} from 'meteor/akryum:vue';
import Activity from '/imports/vue/ui/Activity.vue';
import EditActivity from '/imports/vue/components/activity/EditActivity.vue';
import Destroy from '/imports/vue/components/destroy/Destroy.vue';
import './activity.html';
Template.Wb_activity.onRendered(function () {
    new Vue({
        render: h => h(Activity),
        components: {
            Activity
        }
    }).$mount('#activity');
});

Template.Wb_activity.onDestroyed(function () {
    $('.activity').remove();
});

Template.Wb_activityEdit.onRendered(function () {
    new Vue({
        render: h => h(EditActivity),
        components: {
            EditActivity
        }
    }).$mount('activity-edit');
});

Template.Wb_activityEdit.onDestroyed(function () {
    $('.edit-activity').remove();
});*/


import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './activity.html';


//import Collection
import {Wb_activity} from '../../collection/activity';

//Tabular
import {activityTabular} from '../../../both/tabular/activity';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_activity,
    addTmpl = Template.wb_activityAdd,
    editTmpl = Template.wb_activityEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("activity");
});
addTmpl.onCreated(function () {

});
editTmpl.onCreated(function () {
});


//====================================Render==================
indexTmpl.onRendered(function () {

});

addTmpl.onRendered(function () {
});

editTmpl.onRendered(function () {
});

//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return activityTabular;
    }
});

addTmpl.helpers({
    collection(){
        return Wb_activity;
    }
});

editTmpl.helpers({
    collection(){
        return Wb_activity;
    },
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isActivityHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Activity",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            Wb_activity.remove(self._id, function (error) {
                                if (error) {
                                    // alertify.error(error.message);
                                    Materialize.toast(error.message, 3000, 'red rounded');
                                } else {
                                    // alertify.success("Success");
                                    Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
                                }
                            });
                        },
                        null
                    );
                }
            }
        });
    },
    'click .add' (event, instance) {
        alertify.activity(`<i class="fa fa-plus"></i> Activity`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.activity(`<i class="fa fa-edit"></i> Activity`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-setting/activity/${rowData._id}/edit`);
     }
     'click .edit' (event, instance) {
     FlowRouter.go(`/wb-setting/activity/${this._id}/edit`);
     }*/
});

addTmpl.events({});
editTmpl.events({});
//====================================Destroy=================
indexTmpl.onDestroyed(function () {});
addTmpl.onDestroyed(function () {});
editTmpl.onDestroyed(function () {});
//====================================Hook====================
AutoForm.hooks({
    wb_activityAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Successful');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_activityEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.activity().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});