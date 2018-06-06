import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './tariff.html';


//import Collection
import {WB_Tariff} from '../../collection/tariff';

//Tabular
import {TariffTabular} from '../../../both/tabular/tariff';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_tariff,
    priceRangeTmpl = Template.wb_priceRange,
    addTmpl = Template.wb_tariffAdd,
    editTmpl = Template.wb_tariffEdit;


//====================================State===================


//====================================Create==================

let priceRangeCollecion = new Mongo.Collection(null);


indexTmpl.onCreated(function () {
    createNewAlertify("tariff", {size: "md"});
});
addTmpl.onCreated(function () {


    this.category = new ReactiveVar([]);
    this.type = new ReactiveVar([]);
    this.measure = new ReactiveVar([]);
    this.floorBy = new ReactiveVar([]);

    Meteor.call('wp_fetchCategory', (err, result) => {
        if (result) {
            this.category.set(result);
        }
    });
    Meteor.call('wp_fetchType', (err, result) => {
        if (result) {
            this.type.set(result);
        }
    });
    Meteor.call('wp_fetchMeasure', (err, result) => {
        if (result) {
            this.measure.set(result);
        }
    });
    Meteor.call('wp_fetchFloorBy', (err, result) => {
        if (result) {
            this.floorBy.set(result);
        }
    });

    this.categoryData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.tariffData = new ReactiveVar([]);
    //get collection class || tariff || category
    Meteor.call('getTypeCollection', {collection: 'WB_Class'}, (err, result) => {
        if (!err) {
            this.classData.set(result);
        }
    });
    Meteor.call('getTypeCollection', {collection: 'WB_Category'}, (err, result) => {
        if (!err) {
            this.categoryData.set(result);
        }
    });
    Meteor.call('getTypeCollection', {collection: 'WB_Tariff'}, (err, result) => {
        if (!err) {
            this.tariffData.set(result);
        }
    });
});


editTmpl.onCreated(function () {
    this.category = new ReactiveVar([]);
    this.type = new ReactiveVar([]);
    this.measure = new ReactiveVar([]);
    this.floorBy = new ReactiveVar([]);

    Meteor.call('wp_fetchCategory', (err, result) => {
        if (result) {
            this.category.set(result);
        }
    });
    Meteor.call('wp_fetchType', (err, result) => {
        if (result) {
            this.type.set(result);
        }
    });
    Meteor.call('wp_fetchMeasure', (err, result) => {
        if (result) {
            this.measure.set(result);
        }
    });
    Meteor.call('wp_fetchFloorBy', (err, result) => {
        if (result) {
            this.floorBy.set(result);
        }
    });

    this.subUserReady = new ReactiveVar(false);
    this.categoryData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.tariffData = new ReactiveVar([]);
    //get collection class || tariff || category
    Meteor.call('getTypeCollection', {collection: 'WB_Class'}, (err, result) => {
        if (!err) {
            this.classData.set(result);
        }
    });
    Meteor.call('getTypeCollection', {collection: 'WB_Category'}, (err, result) => {
        if (!err) {
            this.categoryData.set(result);
        }
    });
    Meteor.call('getTypeCollection', {collection: 'WB_Tariff'}, (err, result) => {
        if (!err) {
            this.tariffData.set(result);
        }
    });

    this.autorun(() => {
        let id = FlowRouter.getParam('tariffId');
        if (id) {
            this.subscription = Meteor.subscribe('wb_tariffById', {_id: id});
        }
    });
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
        return TariffTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_Tariff;
    },
    categoryData(){
        let instance = Template.instance();
        return instance.categoryData.get();
    },
    classData(){
        let instance = Template.instance();
        return instance.classData.get();
    },
    tariffData(){
        let instance = Template.instance();
        return instance.tariffData.get();
    },
    category(){
        let instance = Template.instance();
        return instance.category.get();
    },
    type(){
        let instance = Template.instance();
        return instance.type.get();
    },
    measure(){
        let instance = Template.instance();
        return instance.measure.get();
    },
    floorBy(){
        let instance = Template.instance();
        return instance.floorBy.get();
    }
});

editTmpl.helpers({
    collection(){
        return WB_Tariff;
    },
    categoryData(){
        let instance = Template.instance();
        return instance.categoryData.get();
    },
    classData(){
        let instance = Template.instance();
        return instance.classData.get();
    },
    tariffData(){
        let instance = Template.instance();
        return instance.tariffData.get();
    },
    subscriptionsReady(){
        let instance = Template.instance();
        return instance.subUserReady.get();
    },

    data(){
        debugger;
        let id = FlowRouter.getParam('tariffId');
        return WB_Tariff.findOne(id);
    },
    category(){
        let instance = Template.instance();
        return instance.category.get();
    },
    type(){
        let instance = Template.instance();
        return instance.type.get();
    },
    measure(){
        let instance = Template.instance();
        return instance.measure.get();
    },
    floorBy(){
        let instance = Template.instance();
        return instance.floorBy.get();
    }
});


//====================================Event===================
indexTmpl.events({
    'click .editToggle' (event, instance) {
        let self = this;
        let status = this.status == 'enable' ? 'disable' : 'enable';
        alertify.confirm(
            "Tariff",
            `${status} [ ${self._id} ]?`,
            function () {
                WB_Tariff.update(self._id, {$set: {status: status}}, function (error) {
                    if (error) {
                        // alertify.error(error.message);
                        Materialize.toast(error.message, 3000, 'red rounded');
                    } else {
                        // alertify.success("Success");
                        Materialize.toast('Successful ' + status, 3000, 'lime accent-4 rounded');
                    }
                });
            },
            null
        );
    },
    'click .remove'(e, t){
        let self=this;
        Meteor.call('isTariffHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Remove Tariff",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Tariff.remove(self._id, function (error) {
                                if (error) {
                                    // alertify.error(error.message);
                                    Materialize.toast(error.message, 3000, 'red rounded');
                                } else {
                                    // alertify.success("Success");
                                    Materialize.toast('Successful', 3000, 'teal rounded');
                                }
                            });
                        },
                        null
                    );
                }
            }
        });

    },
    'click .edit'(){
        debugger;
        clearCollectionNull();
        let self = this;
        this.rangePrice.forEach(function (obj) {
            priceRangeCollecion.insert(obj);
        });
        /*FlowRouter.go(`/wb-setting/tariff/${this._id}/edit`);*/
        alertify.tariff(`<i class="fa fa-edit"></i> Tariff`, renderTemplate(editTmpl, self));
    },
    "click .add"(e, t){
        alertify.tariff(`<i class="fa fa-plus"></i> Tariff`, renderTemplate(addTmpl));
    }
});

addTmpl.events({
    'change [name="type"]'(event, instance){
        instance.type.set(event.currentTarget.value);
    }
});

editTmpl.events({});


//====================================Destroy=================
indexTmpl.onDestroyed(function () {


});

addTmpl.onDestroyed(function () {

    clearCollectionNull();
});

editTmpl.onDestroyed(function () {

    clearCollectionNull();
});


//====================================Hook====================
AutoForm.hooks({
    wb_tariffAdd: {
        before: {
            insert(doc){
                doc.rolesArea = Session.get('area');
                let rangePrice = [];
                priceRangeCollecion.find().fetch().forEach(function (obj) {
                    rangePrice.push({
                        level: obj.level,
                        startRange: obj.startRange,
                        endRange: obj.endRange,
                        price: obj.price
                    })
                });
                doc.rangePrice = rangePrice;

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            alertify.tariff().close();
            /* FlowRouter.query.unset();*/
            clearCollectionNull();

        },
        onError: function (formType, error) {
            alertify.error(error.message);

            /*let checkError = error.message.match(/11000/i);
             if (checkError) {
             Materialize.toast('Dupplicated!', 3000, 'red rounded');
             } else {
             Materialize.toast(error.message, 3000, 'red rounded');
             }*/
            /*FlowRouter.query.unset();*/
        }
    },
    wb_tariffEdit: {
        before: {
            update: function (doc) {
                debugger;
                let rangePrice = [];
                priceRangeCollecion.find().fetch().forEach(function (obj) {
                    if (obj) {
                        rangePrice.push({
                            level: obj.level,
                            startRange: obj.startRange,
                            endRange: obj.endRange,
                            price: obj.price
                        })
                    }
                });
                doc.$set.rangePrice = rangePrice;
                doc.$unset = {};
                return doc;
            }

        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            alertify.tariff().close();
            clearCollectionNull();

        },
        onError: function (formType, error) {
            if (error) {
                alertify.error(error.message);
            }

        },
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            event.preventDefault();
            this.done();
        }
    }
});

let idPriceRange = new ReactiveVar();

priceRangeTmpl.helpers({
    schema(){
        return WB_Tariff.priceRange;
    },
    priceRnage(){
        return priceRangeCollecion.find();
    }
})

priceRangeTmpl.onRendered(function () {
    // $('.collapsible').collapsible();
    clearForm();
})

priceRangeTmpl.events({
    'click .add'(e, t){
        let data = {};
        let lastPriceRange = priceRangeCollecion.findOne({}, {sort: {level: -1}});
        data.price = $("[name='price']").val();
        data.startRange = $("[name='startRange']").val();
        data.endRange = $("[name='endRange']").val();
        if (data.price == "" || data.startRange == "" || data.endRange == "") {
            alertify.warning('Please input value in "Start Range, End Range and Price".');
            return;
        }
        data.price = parseFloat(data.price);
        data.startRange = parseFloat(data.startRange);
        data.endRange = parseFloat(data.endRange);
        data.level = 1;
        if (data.startRange >= data.endRange) {
            alertify.warning("EndRange must be greater than StartRange");
            return;
        }
        if (lastPriceRange) {
            if (lastPriceRange.endRange != data.startRange) {
                alertify.warning("StartRange must be equal to last EndRange");
                return;
            }
            data.level = lastPriceRange.level + 1;

        }
        priceRangeCollecion.insert(data);
        clearForm();
    },
    'click .del'(e, t){
        let self = this;
        priceRangeCollecion.remove(self._id);
    },
    'keyup [name="startRangeOutput"]'(e, t){

        let val = e.currentTarget.value;
        priceRangeCollecion.update({_id: idPriceRange.get()}, {$set: {startRange: val}});

    }, 'keyup [name="endRangeOutput"]'(e, t){

        let val = e.currentTarget.value;
        priceRangeCollecion.update({_id: idPriceRange.get()}, {$set: {endRange: val}});

    }, 'keyup [name="priceOutput"]'(e, t){

        let val = e.currentTarget.value;
        priceRangeCollecion.update({_id: idPriceRange.get()}, {$set: {price: val}});

    },
    'click .data-row'(e, t){
        let self = this;
        idPriceRange.set(self._id);
    }
})

let clearForm = function () {
    $("[name='price']").val("");
    $("[name='startRange']").val("");
    $("[name='endRange']").val("");
}

let clearCollectionNull = function () {
    priceRangeCollecion.remove({});
}