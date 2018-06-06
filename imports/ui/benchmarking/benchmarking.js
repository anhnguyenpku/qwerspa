import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './benchmarking.html';


//import Collection
import {WB_Benchmarking} from '../../collection/benchmarking';

//Tabular
import {BenchmarkingTabular} from '../../../both/tabular/benchmarking';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_benchmarking,
    addTmpl = Template.wb_benchmarkingAdd,
    editTmpl = Template.wb_benchmarkingEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("benchmarking");
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
        return BenchmarkingTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_Benchmarking;
    }
});

editTmpl.helpers({
    collection(){
        return WB_Benchmarking;
    },
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        alertify.confirm(
            "Benchmarking",
            "Are you sure to delete [" + self._id + "]?",
            function () {
                WB_Benchmarking.remove(self._id, function (error) {
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
       /* Meteor.call('isBenchmarkingHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Benchmarking",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Benchmarking.remove(self._id, function (error) {
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
        });*/

    },
    'click .add' (event, instance) {
        alertify.benchmarking(`<i class="fa fa-plus"></i> Benchmarking`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.benchmarking(`<i class="fa fa-edit"></i> Benchmarking`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/benchmarking/${rowData._id}/edit`);
    }
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-setting/benchmarking/${this._id}/edit`);
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
    wb_benchmarkingAdd: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_benchmarkingEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.benchmarking().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});