import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './quartier.html';


//import Collection
import {WB_Quartier} from '../../collection/quartier';

//Tabular
import {QuartierTabular} from '../../../both/tabular/quartier';
import {clearSelect2} from "../../../client/libs/clear-select";
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";

let indexTmpl = Template.wb_quartier,
    addTmpl = Template.wb_quartierAdd,
    editTmpl = Template.wb_quartierEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("quartier");
    this.selector =new ReactiveVar({rolesArea: Session.get('area')});
});
addTmpl.onCreated(function () {
    this.districtData = new ReactiveVar([]);
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.districtData.set(result);
        }
    });
});
editTmpl.onCreated(function () {
    this.districtData = new ReactiveVar([]);
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.districtData.set(result);
        }
    });
});
//====================================Render==================
indexTmpl.onRendered(function () {});
addTmpl.onRendered(function () {});
editTmpl.onRendered(function () {});
//====================================Helper==================
indexTmpl.helpers({
    dataTable(){
        return QuartierTabular;
    },
    selector(){
        let instance = Template.instance();
        return instance.selector.get();

    }
});

addTmpl.helpers({
    collection(){
        return WB_Quartier;
    },
    fetchGeneralDistrict(){
        let instance = Template.instance();
        return instance.districtData.get();
    }
});

editTmpl.helpers({
    collection(){
        return WB_Quartier;
    },
    fetchGeneralDistrict(){
        let instance = Template.instance();
        return instance.districtData.get();
    }
});


//====================================Event===================
indexTmpl.events({
    'keyup #district-name'(e,t){
        debugger;
        let selector=makeSelector();
        t.selector.set(selector);
    },
    'click .remove'(e, t){
        let self=this;
        Meteor.call('isQuartierHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Quartier",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Quartier.remove(self._id, function (error) {
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
        alertify.quartier(`<i class="fa fa-plus"></i> Quartier`, renderTemplate(addTmpl));
    },
    'click .edit' (event, instance) {
        let self = this;
        alertify.quartier(`<i class="fa fa-edit"></i> Quartier`, renderTemplate(editTmpl, self));
    }

});

addTmpl.events({});
editTmpl.events({});

editTmpl.onRendered(function () {
    $("[name='districtCodeId']").attr("readonly", "readonly");

})
//====================================Destroy=================
indexTmpl.onDestroyed(function () {
});
addTmpl.onDestroyed(function () {
});
editTmpl.onDestroyed(function () {
    $("[name='districtCodeId']").removeAttr('readonly');

});
//====================================Hook====================
AutoForm.hooks({
    wb_quartierAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2($("[name='districtCodeId']"));
            alertify.success("Successful")
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_quartierEdit: {
        onSuccess: function (formType, result) {
           alertify.success("Successful");
           alertify.quartier().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});



function makeSelector(){
    let selector={rolesArea: Session.get('area')};
    let district=$('#district-name').val();
    if(district!=""){
        let findCode={'districtDoc.code':new RegExp("" + district, "i")};
        let findName={'districtDoc.name':new RegExp("" + district, "i")};
        selector.$or=[findCode,findName];
    }
    return selector;
}