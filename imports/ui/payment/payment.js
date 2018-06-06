
import ReceivePayment from '/imports/vue/ui/Payment.vue';

import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './payment.html';


//import Collection
import {WB_Payment} from '../../collection/payment';

//Tabular
import {PaymentTabular} from '../../../both/tabular/payment';

let indexTmpl = Template.Wb_payment,
    addTmpl = Template.wb_paymentAdd,
    editTmpl = Template.wb_paymentEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {

});
addTmpl.onCreated(function () {

});
editTmpl.onCreated(function () {
    this.subUserReady = new ReactiveVar(false);
    this.autorun(()=>{
        let id = FlowRouter.getParam('paymentId');
        if(id){
            this.subscription = Meteor.subscribe('wb_paymentById', {_id: id});
        }
    });
});


//====================================Render==================
indexTmpl.onRendered(function () {

});

editTmpl.onRendered(function () {
    this.autorun(()=>{
        if(this.subscription.ready()){
            this.subUserReady.set(true);
        }
    });
});

addTmpl.onRendered(function () {
    Vue.prototype.$jQuery = $;
    new Vue({
        render: h => h(ReceivePayment)
    }).$mount('payment');
});
//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return PaymentTabular;
    },
    selector(){
        return {rolesArea: Session.get('area'), createdBy: Meteor.userId()};
    }
});

addTmpl.helpers({
    collection(){
        return WB_Payment;
    }
});

editTmpl.helpers({
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },
    collection(){
        return WB_Payment;
    },
    data(){
        let id = FlowRouter.getParam('paymentId');
        return WB_Payment.findOne(id);
    }

});



//====================================Event===================
indexTmpl.events({
    'click .remove'(e,t){
        var self=this;
        alertify.confirm(
            "Payment",
            "Are you sure to delete [" + self._id + "]?",
            function () {
                WB_Payment.remove(self._id, function (error) {
                    if (error) {
                        // alertify.error(error.message);
                        // Materialize.toast(error.message, 3000, 'red rounded');
                    } else {
                        // alertify.success("Success");
                        // Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
                    }
                });
            },
            null
        );
    },
    /*'dblclick tbody > tr' (event, instance) {

     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
     let rowData = dataTalbe.row(event.currentTarget).data();
     FlowRouter.go(`/wb-debt/payment/${rowData._id}/edit`);
     }*/
    'click .new'(event,instance){
        FlowRouter.go(`/wb-debt/payment/new`);
    },
    'click .edit' (event, instance) {
        FlowRouter.go(`/wb-debt/payment/${this._id}/edit`);
    }
});

addTmpl.events({});

editTmpl.events({
    'click .cancel'(e,t){
        FlowRouter.go(`/wb-debt/payment`);
    }
});


//====================================Destroy=================
indexTmpl.onDestroyed(function () {


});

addTmpl.onDestroyed(function () {
    $('div.receive-payment').empty();
});

editTmpl.onDestroyed(function () {


});


//====================================Hook====================
AutoForm.hooks({
    wb_paymentAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            $('#wb_paymentAddModal').modal('close');
            Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
        },
        onError: function (formType, error) {
            Materialize.toast(error.message, 3000, 'red rounded');
        }
    },
    wb_paymentEdit: {
        before: {
            insert: function (doc) {

            }
        },
        onSuccess: function (formType, result) {
            FlowRouter.go(`/wb-debt/payment`);
            Materialize.toast('Successful', 3000, 'lime accent-4 rounded');

        },
        onError: function (formType, error) {


        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            event.preventDefault();
            this.done();
        }
    }
});