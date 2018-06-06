import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './agent.html';


//import Collection
import {WB_Agent} from '../../collection/agent';

//Tabular
import {AgentTabular} from '../../../both/tabular/agent';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_agent,
    addTmpl = Template.wb_agentAdd,
    editTmpl = Template.wb_agentEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("agent");
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
        return AgentTabular;
    },
    selector(){
        return {rolesArea: Session.get('area')};
    }
});
addTmpl.helpers({
    collection(){
        return WB_Agent;
    }
});
editTmpl.helpers({
    collection(){
        return WB_Agent;
    }
});
//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        let self=this;
        Meteor.call('isAgentHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Agent",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Agent.remove(self._id, function (error) {
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
        alertify.agent(`<i class="fa fa-plus"></i> Agent`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.agent(`<i class="fa fa-edit"></i> Agent`, renderTemplate(editTmpl, self));
    }
    /*'dblclick tbody > tr' (event, instance) {

        let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        let rowData = dataTalbe.row(event.currentTarget).data();
        FlowRouter.go(`/wb-setting/agent/${rowData._id}/edit`);
    }
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-setting/agent/${this._id}/edit`);
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
    wb_agentAdd: {
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
    wb_agentEdit: {
        onSuccess: function (formType, result) {
            alertify.success("Successful");
            alertify.agent().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});