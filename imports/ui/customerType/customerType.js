import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './customerType.html';


//import Collection
import {WB_CustomerType} from '../../collection/customerType';

//Tabular
import {CustomerTypeTabular} from '../../../both/tabular/customerType';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_customerType,
    addTmpl = Template.wb_customerTypeAdd,
    editTmpl = Template.wb_customerTypeEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("customerType");
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
        return CustomerTypeTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_CustomerType;
    }
});

editTmpl.helpers({
    collection(){
        return WB_CustomerType;
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t){
        var self = this;
        alertify.confirm(
            "Customer Type",
            "Are you sure to delete [" + self._id + "]?",
            function () {
                WB_CustomerType.remove(self._id, function (error) {
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
    },
    /* 'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-setting/customerType/${rowData._id}/edit`);
     },*/

    'click .add' (event, instance) {
        alertify.customerType(`<i class="fa fa-plus"></i> Customer Type`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.customerType(`<i class="fa fa-edit"></i> Customer Type`, renderTemplate(editTmpl, self));
    }
})

addTmpl.events({})

editTmpl.events({})


//====================================Destroy=================
indexTmpl.onDestroyed(function () {})

addTmpl.onDestroyed(function () {

})

editTmpl.onDestroyed(function () {


})


//====================================Hook====================
AutoForm.hooks({
    wb_customerTypeAdd: {
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
    wb_customerTypeEdit: {
        before: {
            insert: function (doc) {
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.customerType().close();

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