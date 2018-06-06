import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './operationCode.html';


//import Collection
import {WB_OperationCode} from '../../collection/operationCode';

//Tabular
import {OperationCodeTabular} from '../../../both/tabular/operationCode';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_operationCode,
    addTmpl = Template.wb_operationCodeAdd,
    editTmpl = Template.wb_operationCodeEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("operationCode");
});
addTmpl.onCreated(function () {

});
editTmpl.onCreated(function () {
    this.subUserReady = new ReactiveVar(false);
    this.autorun(()=>{
        let id = FlowRouter.getParam('operationCodeId');
        if(id){
            this.subscription = Meteor.subscribe('wb_operationCodeById', {_id: id});
        }
    });
});


//====================================Render==================
indexTmpl.onRendered(function () {

});

addTmpl.onRendered(function () {
    $('.modal').modal();
});

editTmpl.onRendered(function () {
    this.autorun(()=>{
        if(this.subscription.ready()){
            this.subUserReady.set(true)
        }
    });
});

//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return OperationCodeTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_OperationCode;
    }
});

editTmpl.helpers({
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },
    collection(){
        return WB_OperationCode;
    },
    data(){

        let id = FlowRouter.getParam('operationCodeId');
        return WB_OperationCode.findOne(id);
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isOperationCodeHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Operation Code",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_OperationCode.remove(self._id, function (error) {
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
        alertify.operationCode(`<i class="fa fa-plus"></i> OperationCode`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.operationCode(`<i class="fa fa-edit"></i> OperationCode`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/operationCode/${rowData._id}/edit`);
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
    wb_operationCodeAdd: {
        onSuccess: function (formType, result) {
            alertify.success("Successful")
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_operationCodeEdit: {
        onSuccess: function (formType, result) {
            alertify.success("Successful");
            alertify.operationCode().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});