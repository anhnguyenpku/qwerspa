import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './class.html';


//import Collection
import {WB_Class} from '../../collection/class';
//Tabular
import {ClassTabular} from '../../../both/tabular/class';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_class,
    addTmpl = Template.wb_classAdd,
    editTmpl = Template.wb_classEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("class");
});
addTmpl.onCreated(function () {

});
editTmpl.onCreated(function () {
    this.subUserReady = new ReactiveVar(false);
    this.autorun(() => {
        let id = FlowRouter.getParam('classId');
        if (id) {
            this.subscription = Meteor.subscribe('wb_classById', {_id: id});
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
        return ClassTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_Class;
    }
});

editTmpl.helpers({
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },
    collection(){
        return WB_Class;
    },
    data(){

        let id = FlowRouter.getParam('classId');
        return WB_Class.findOne(id);
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t){

        let self=this;
        Meteor.call('isClassHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Class",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Class.remove(self._id, function (error) {
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
        alertify.class(`<i class="fa fa-plus"></i> Class`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.class(`<i class="fa fa-edit"></i> Class`, renderTemplate(editTmpl, self));
    }
    /* 'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-setting/class/${rowData._id}/edit`);
     }
     'click .edit' (event, instance) {
     FlowRouter.go(`/wb-setting/class/${this._id}/edit`);
     }*/
});

addTmpl.events({});

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
    wb_classAdd: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_classEdit: {
        onSuccess: function (formType, result) {
            alertify.success('Successful');
            alertify.class().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
})