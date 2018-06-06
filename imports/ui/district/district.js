import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './district.html';


//import Collection
import {WB_District} from '../../collection/district';

//Tabular
import {DistrictTabular} from '../../../both/tabular/district';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_district,
    addTmpl = Template.wb_districtAdd,
    editTmpl = Template.wb_districtEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("district");
});
addTmpl.onCreated(function () {});
editTmpl.onCreated(function () {});
//====================================Render==================
indexTmpl.onRendered(function () {});
addTmpl.onRendered(function () {
    $('.modal').modal();
});
editTmpl.onRendered(function () {});
//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return DistrictTabular;
    },
    selector(){
        return {rolesArea: Session.get('area')};
    }
});
addTmpl.helpers({
    collection(){
        return WB_District;
    }
});
editTmpl.helpers({
    collection(){
        return WB_District;
    }
});
//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isDistrictHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "District",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_District.remove(self._id, function (error) {
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
        alertify.district(`<i class="fa fa-plus"></i> District`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.district(`<i class="fa fa-edit"></i> District`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/district/${rowData._id}/edit`);
    }
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-setting/district/${this._id}/edit`);
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
    wb_districtAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
          alertify.success("Successful")
        },
        onError: function (formType, error) {
           alertify.error(error.message);
        }
    },
    wb_districtEdit: {
        onSuccess: function (formType, result) {
            alertify.success("Successful");
            alertify.district().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});