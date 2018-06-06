import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
//Import Page
import './meterReading.html';


//import Collection
import {WB_MetersReading} from '../../collection/meterReading';

//Tabular
import {MeterReadingTabular} from '../../../both/tabular/meterReading';


let indexTmpl = Template.wb_meterReading,
    addTmpl = Template.wb_meterReadingAdd,
    editTmpl = Template.wb_meterReadingEdit;


//====================================State===================


//====================================Create==================


indexTmpl.onCreated(function () {

});
addTmpl.onCreated(function () {

    this.categoryData = new ReactiveVar([]);
    this.customerTypeData = new ReactiveVar([]);
    this.operationCodeData = new ReactiveVar([]);
    this.districtId = new ReactiveVar();
    this.quartierId = new ReactiveVar();
    this.districtData = new ReactiveVar([]);
    this.quartierData = new ReactiveVar([]);
    this.blockData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.positionData = new ReactiveVar([]);
    this.userOption = new ReactiveVar([]);
    this.categoryId = new ReactiveVar();
    Meteor.call('fetchCategoryData', (err, result) => {
        if (result) {
            this.categoryData.set(result);
        }
    });

    // Meteor.call('fetchClassData', (err, result) => {
    //     if (result) {
    //         this.classData.set(result);
    //     }
    // });

    Meteor.call('fetchCustomerTypeData', (err, result) => {
        if (result) {
            this.customerTypeData.set(result);
        }
    });
    Meteor.call('fetchOperationCodeData', (err, result) => {
        if (result) {
            this.operationCodeData.set(result);
        }
    });

    Meteor.call('fetchUserAssign', (err, result) => {
        if (result) {
            this.userOption.set(result);
        }
    });


    this.autorun(() => {
        let quartierId = this.quartierId.get();
        let districtId = this.districtId.get();
        let categoryId = this.categoryId.get();

        //get district
        Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
            if (result) {
                this.districtData.set(result);
            } else {
                console.log(err.message);
            }
        });


        if (districtId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtId, (err, result) => {
                if (result) {
                    this.quartierData.set(result);
                }
            });
        }
        if (quartierId) {
            Meteor.call('fetchBlockByQuartierCode', quartierId, (err, result) => {
                if (result) {
                    this.blockData.set(result);
                }
            });
        }
        if (categoryId) {
            Meteor.call('fetchClassDataByCategoryId', categoryId, (err, result) => {
                if (!err) {
                    this.classData.set(result);
                }
            });
        }
    })


});
editTmpl.onCreated(function () {
    this.categoryData = new ReactiveVar([]);
    this.customerTypeData = new ReactiveVar([]);
    this.operationCodeData = new ReactiveVar([]);
    this.districtId = new ReactiveVar();
    this.quartierId = new ReactiveVar();
    this.districtData = new ReactiveVar([]);
    this.quartierData = new ReactiveVar([]);
    this.blockData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.userOption = new ReactiveVar([]);
    this.categoryId = new ReactiveVar(this.data.categoryId);

    Meteor.call('fetchCategoryData', (err, result) => {
        if (result) {
            this.categoryData.set(result);
        }
    });
    // Meteor.call('fetchClassData', (err, result) => {
    //     if (result) {
    //         this.classData.set(result);
    //     }
    // });
    Meteor.call('fetchCustomerTypeData', (err, result) => {
        if (result) {
            this.customerTypeData.set(result);
        }
    });
    Meteor.call('fetchOperationCodeData', (err, result) => {
        if (result) {
            this.operationCodeData.set(result);
        }
    });
    Meteor.call('fetchUserAssign', (err, result) => {
        if (result) {
            this.userOption.set(result);
        }
    });


    this.subUserReady = new ReactiveVar(false);

    this.autorun(() => {
        let quartierId = this.quartierId.get();
        let districtId = this.districtId.get();
        let categoryId = this.categoryId.get();


        //get district
        Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
            if (result) {
                this.districtData.set(result);
            } else {
                console.log(err.message);
            }
        });


        if (districtId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtId, (err, result) => {
                if (result) {
                    this.quartierData.set(result);
                }
            });
        }
        if (quartierId) {
            Meteor.call('fetchBlockByQuartierCode', quartierId, (err, result) => {
                if (result) {
                    this.blockData.set(result);
                }
            });
        }

        let id = FlowRouter.getParam('meterReadingId');
        if (id) {
            this.subscription = Meteor.subscribe('wb_meterReadingById', {_id: id});
        }
        if (categoryId) {
            Meteor.call('fetchClassDataByCategoryId', categoryId, (err, result) => {
                if (!err) {
                    this.classData.set(result);
                }
            });
        }
    })
});


//====================================Render==================
indexTmpl.onRendered(function () {

});

addTmpl.onRendered(function () {
    $('[name="categoryId"]').select2();
    $('[name="customerTypeId"]').select2();
    $('[name="districtId"]').select2();
    $('[name="quartierId"]').select2();
    $('[name="operationCodeId"]').select2();
    $('[name="blockId"]').select2();
    $('[name="classId"]').select2();
});

editTmpl.onRendered(function () {
    this.autorun(() => {

        if (this.subscription.ready()) {
            this.subUserReady.set(true);
            Meteor.setTimeout(function () {
                $('.collapsible').collapsible();
                $('[name="categoryId"]').select2();
                $('[name="customerTypeId"]').select2();
                $('[name="districtId"]').select2();
                $('[name="quartierId"]').select2();
                $('[name="operationCodeId"]').select2();
                $('[name="blockId"]').select2();
                $('[name="classId"]').select2();

            }, 200);
            let id = FlowRouter.getParam('meterReadingId');
            let meterReading = WB_MetersReading.findOne(id);
            if(meterReading && meterReading.categoryId) {
                this.categoryId.set(meterReading.categoryId);
            }
            if (meterReading && meterReading.districtId) {
                this.districtId.set(meterReading.districtId);
            }
            if (meterReading && meterReading.quartierId) {
                this.quartierId.set(meterReading.quartierId);
            }
        }
    });
});

//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return MeterReadingTabular;
    },
    collection(){
        return WB_MetersReading;
    },
    selector(){
        return {
            rolesArea: Session.get('area')
        };
    }
});

addTmpl.helpers({
    collection(){
        return WB_MetersReading;
    },
    category(){
        let instance = Template.instance();
        return instance.categoryData.get();
    },
    customerType(){
        let instance = Template.instance();
        return instance.customerTypeData.get();
    },
    operationCode(){
        let instance = Template.instance();
        return instance.operationCodeData.get();
    },
    district(){
        let instance = Template.instance();
        return instance.districtData.get();
    },
    quartier(){
        let instance = Template.instance();
        return instance.quartierData.get();
    },
    block(){
        let instance = Template.instance();
        return instance.blockData.get();
    },
    class(){
        let instance = Template.instance();
        return instance.classData.get();
    },
    userOption(){
        let instance = Template.instance();
        return instance.userOption.get();
    }
});

editTmpl.helpers({
    collection(){
        return WB_MetersReading;
    },
    category(){
        let instance = Template.instance();
        return instance.categoryData.get();
    },
    customerType(){
        let instance = Template.instance();
        return instance.customerTypeData.get();
    },
    operationCode(){
        let instance = Template.instance();
        return instance.operationCodeData.get();
    },
    district(){
        let instance = Template.instance();
        return instance.districtData.get();
    },
    quartier(){
        let instance = Template.instance();
        return instance.quartierData.get();
    },
    block(){
        let instance = Template.instance();
        return instance.blockData.get();
    },
    data(){
        let id = FlowRouter.getParam('meterReadingId');
        return WB_MetersReading.findOne({_id: id});
    },
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },
    class(){
        let instance = Template.instance();
        return instance.classData.get();
    },
    userOption(){
        let instance = Template.instance();
        return instance.userOption.get();
    }


});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e){
        var self = this;
        alertify.confirm(
            'Meter Reading',
            'Are you sure to delete [' + self._id + ']?',
            () => {
                WB_MetersReading.remove(self._id, (error) => {
                    if (error) {
                        alertify.error(error.message)
                        // Materialize.toast(error.message, 3000, 'red rounded')
                    } else {
                        alertify.success("Success");
                        // Materialize.toast('Successful', 3000, 'lime accent-4 rounded')
                        $(e.currentTarget).parents('tr').remove();
                    }
                })
            },
            null
        )

    },
    'click .add'(){
        FlowRouter.go(`/wb-data/meterReading/add`);
    },
    'click .edit' (event, instance) {
        // let dataTalbe = $(event.currentTarget).closest('table').DataTable();
        // let rowData = dataTalbe.row(event.currentTarget).data();
        let self = this;
        FlowRouter.go(`/wb-data/meterReading/${self._id}/edit`);
    },
    'click .show'(event, instance){
        let self = this;
        FlowRouter.go(`/wb-data/meterReading/${self._id}/show`);
    }
});
addTmpl.events({
    'click .cancel'(e, t){
        FlowRouter.go(`/wb-data/meterReading`);
    },
    'change [name="districtId"]'(event, instance){
        instance.districtId.set(event.currentTarget.value);
    },
    'change [name="quartierId"]'(event, instance){
        instance.quartierId.set(event.currentTarget.value);
    },
    'change [name="categoryId"]'(event,instance){
        let currentTarget = $(event.currentTarget);
        if(!!currentTarget.val()) {
            instance.categoryId.set(currentTarget.val());
        }
    }
});
editTmpl.events({
    'click .cancel'(e, t){
        FlowRouter.go(`/wb-data/meterReading`);
    },
    'change [name="districtId"]'(event, instance){
        instance.districtId.set(event.currentTarget.value);
    },
    'change [name="quartierId"]'(event, instance){
        instance.quartierId.set(event.currentTarget.value);
    },
    'change [name="categoryId"]'(event,instance){
        let currentTarget = $(event.currentTarget);
        if(!!currentTarget.val()) {
            instance.categoryId.set(currentTarget.val());
        }
    }
});

//====================================Destroy=================
indexTmpl.onDestroyed(function () {
});
addTmpl.onDestroyed(function () {
});
editTmpl.onDestroyed(function () {
});

//====================================Hook====================
AutoForm.hooks({
    wb_meterReadingAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            // Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
            FlowRouter.go(`/wb-data/meterReading`);

            FlowRouter.query.unset();
        },
        onError: function (formType, error) {
            // Materialize.toast(error.message, 3000, 'red rounded');
            alertify.error(error.message);
            FlowRouter.query.unset();
        }
    },
    wb_meterReadingEdit: {
        onSuccess: function (formType, result) {
            // Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
            alertify.success("Success");
            FlowRouter.go(`/wb-data/meterReading`);
            FlowRouter.query.unset();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
            FlowRouter.query.unset();

        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            event.preventDefault();
            this.done();
        }
    }
});