import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './meterCode.html';


//import Collection
import {WB_MeterCode} from '../../collection/meterCode';

//Tabular
import {MeterCodeTabular} from '../../../both/tabular/meterCode';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_meterCode,
    addTmpl = Template.wb_meterCodeAdd,
    editTmpl = Template.wb_meterCodeEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("meterCode");
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
        return MeterCodeTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_MeterCode;
    }
});

editTmpl.helpers({
    collection(){
        return WB_MeterCode;
    },
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isMeterCodeHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "MeterCode",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_MeterCode.remove(self._id, function (error) {
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
        alertify.meterCode(`<i class="fa fa-plus"></i> MeterCode`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.meterCode(`<i class="fa fa-edit"></i> MeterCode`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/meterCode/${rowData._id}/edit`);
    }
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-setting/meterCode/${this._id}/edit`);
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
    wb_meterCodeAdd: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_meterCodeEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.meterCode().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});