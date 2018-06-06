import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './referenceType.html';


//import Collection
import {WB_ReferenceType} from '../../collection/referenceType';

//Tabular
import {ReferenceTypeTabular} from '../../../both/tabular/referenceType';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_referenceType,
    addTmpl = Template.wb_referenceTypeAdd,
    editTmpl = Template.wb_referenceTypeEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("referenceType");
});
addTmpl.onCreated(function () {

});
editTmpl.onCreated(function () {
    this.subUserReady = new ReactiveVar(false);
    this.autorun(() => {
        let id = FlowRouter.getParam('referenceTypeId');
        if (id) {
            this.subscription = Meteor.subscribe('wb_referenceTypeById', {_id: id});
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
    this.autorun(() => {
        if (this.subscription.ready()) {
            this.subUserReady.set(true)
        }
    });
});

//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return ReferenceTypeTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_ReferenceType;
    }
});

editTmpl.helpers({
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },
    collection(){
        return WB_ReferenceType;
    },
    data(){

        let id = FlowRouter.getParam('referenceTypeId');
        return WB_ReferenceType.findOne(id);
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t){
        var self = this;
        alertify.warning("Can't Remove");

        /*alertify.confirm(
         "Reference Type",
         "Are you sure to delete [" + self._id + "]?",
         function () {
         WB_ReferenceType.remove(self._id, function (error) {
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
         );*/
    },
    /* 'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-setting/referenceType/${rowData._id}/edit`);
     }*/
    'click .edit' (event, instance) {
        let doc = this;
        alertify.referenceType(`<i class="fa fa-edit"></i> Reference Type`, renderTemplate(editTmpl, doc));

        // FlowRouter.go(`/wb-setting/referenceType/${this._id}/edit`);
    },
    'click .add'(e, t){
        alertify.referenceType(`<i class="fa fa-plus"></i> Reference Type`, renderTemplate(addTmpl));
    }
})

addTmpl.events({})

editTmpl.events({})


//====================================Destroy=================
indexTmpl.onDestroyed(function () {


})

addTmpl.onDestroyed(function () {


})

editTmpl.onDestroyed(function () {


})


//====================================Hook====================
AutoForm.hooks({
    wb_referenceTypeAdd: {
        before: {
            insert: function (doc) {
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
    wb_referenceTypeEdit: {
        before: {
            insert: function (doc) {
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.referenceType().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            event.preventDefault();
            this.done();
        }
    }
})