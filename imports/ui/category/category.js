import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './category.html';


//import Collection
import {WB_Category} from '../../collection/category';

//Tabular
import {CategoryTabular} from '../../../both/tabular/category';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_category,
    addTmpl = Template.wb_categoryAdd,
    editTmpl = Template.wb_categoryEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("category");
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
        return CategoryTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_Category;
    }
});

editTmpl.helpers({
    collection(){
        return WB_Category;
    },
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isCategoryHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Category",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Category.remove(self._id, function (error) {
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
        alertify.category(`<i class="fa fa-plus"></i> Category`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.category(`<i class="fa fa-edit"></i> Category`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/category/${rowData._id}/edit`);
    }
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-setting/category/${this._id}/edit`);
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
    wb_categoryAdd: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_categoryEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.category().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});