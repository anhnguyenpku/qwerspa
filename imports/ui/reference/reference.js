import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './reference.html';


//import Collection
import {WB_Reference} from '../../collection/reference';

//Tabular
import {ReferenceTabular} from '../../../both/tabular/reference';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";


let indexTmpl = Template.wb_reference,
    addTmpl = Template.wb_referenceAdd,
    editTmpl = Template.wb_referenceEdit;


//====================================State===================

let referenceType = new ReactiveVar([]);
//====================================Create==================

indexTmpl.onCreated(function () {
});
addTmpl.onCreated(function () {
    Meteor.call('wp_fetchReferenceType', (err, result) => {
        if (result) {
            referenceType.set(result);
        }
    });
});
editTmpl.onCreated(function () {
    Meteor.call('wp_fetchReferenceType', (err, result) => {
        if (result) {
            referenceType.set(result);
        }
    });
});


//====================================Render==================
indexTmpl.onRendered(function () {
    createNewAlertify("reference");
});

addTmpl.onRendered(function () {

});

editTmpl.onRendered(function () {

});

//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return ReferenceTabular;
    }
});

addTmpl.helpers({
    collection(){
        return WB_Reference;
    },
    referenceType(){
        return referenceType.get();
    }
});

editTmpl.helpers({

    collection(){
        return WB_Reference;
    },
    referenceType(){
        return referenceType.get();
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t){
        let self=this;
        Meteor.call('isReferenceHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Reference",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Reference.remove(self._id, function (error) {
                                if (error) {
                                    alertify.error(error.message);

                                } else {
                                    alertify.success("Success");

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
        alertify.reference(`<i class="fa fa-plus"></i> Reference`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.reference(`<i class="fa fa-plus"></i> Reference`, renderTemplate(editTmpl, self));
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
    wb_referenceAdd: {
        before: {
            insert: function (doc) {
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            alertify.reference().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_referenceEdit: {
        before: {
            insert: function (doc) {
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            alertify.reference().close();

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