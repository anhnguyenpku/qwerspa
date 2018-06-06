/*
import './meterType.html';

import {WB_MeterType} from '../../collection/meterType';
let indexTmpl = Template.Wb_meterType;
let queryMeterType = new ReactiveVar([]);


indexTmpl.onCreated(function () {
    Meteor.call('findMeterType', function (err, result) {
        if (!err) {
            console.log(result);
            queryMeterType.set(result);
        } else {
            console.log(err.message);
        }
    });
});
indexTmpl.helpers({
    collection(){
        return WB_MeterType;
    },
    meterTypes(){
        return queryMeterType.get();
    }
});
indexTmpl.onDestroyed(function () {
    queryMeterType.set([]);
});
indexTmpl.events({
    'click .remove'(event, instance){
        var self = this;
        alertify.confirm(
            "District",
            "Are you sure to delete [" + self._id + "]?",
            function () {
                Meteor.call('removeMeterType', self._id, function (error) {
                    if (error) {
                        // alertify.error(error.message);
                        Materialize.toast(error.message, 3000, 'red rounded');
                    } else {
                        // alertify.success("Success");
                        Meteor.call('findMeterType', function (err, res) {
                            if (!err) {
                                queryMeterType.set(res);
                            } else {
                                console.log(err.message);
                            }
                        });
                        Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
                    }
                });
            },
            null
        );
    }
});
AutoForm.hooks({
    meterTypeNew: {
        onSuccess(f, r){
            Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
            Meteor.call('findMeterType', function (err, res) {
                if (!err) {
                    queryMeterType.set(res);
                } else {
                    console.log(err.message);
                }
            });
        },
        onError(f, err){
            Materialize.toast(err.message, 3000, 'lime accent-4 red');
        }
    }
});*/

import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './meterType.html';


//import Collection
import {WB_MeterType} from '../../collection/meterType';

//Tabular
import {meterTypeTabular} from '../../../both/tabular/meterType';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.Wb_meterType,
    addTmpl = Template.wb_meterTypeAdd,
    editTmpl = Template.wb_meterTypeEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("meterType");
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
        return meterTypeTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_MeterType;
    }
});

editTmpl.helpers({
    collection(){
        return WB_MeterType;
    },
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isMeterTypeHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Meter Type",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_MeterType.remove(self._id, function (error) {
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
        alertify.meterType(`<i class="fa fa-plus"></i> Meter Type`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.meterType(`<i class="fa fa-edit"></i> Meter Type`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-setting/meterType/${rowData._id}/edit`);
     }
     'click .edit' (event, instance) {
     FlowRouter.go(`/wb-setting/meterType/${this._id}/edit`);
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
    wb_meterTypeAdd: {
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
    wb_meterTypeEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.meterType().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});