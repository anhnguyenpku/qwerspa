import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from 'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './block.html';


//import Collection
import {WB_Block} from '../../collection/block';

//Tabular
import {BlockTabular} from '../../../both/tabular/block';
import {clearSelect2} from "../../../client/libs/clear-select";
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";


let indexTmpl = Template.wb_block,
    addTmpl = Template.wb_blockAdd,
    editTmpl = Template.wb_blockEdit;


//====================================State===================


//====================================Create==================

indexTmpl.onCreated(function () {
    createNewAlertify("block")
});
addTmpl.onCreated(function () {
    this.districtCodeData = new ReactiveVar([]);
    this.districtCode = new ReactiveVar();
    this.quartierIdData = new ReactiveVar([]);
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.districtCodeData.set(result);
        }
    });
    this.autorun(() => {
        let districtCodeId = this.districtCode.get();
        if (districtCodeId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtCodeId, (err, result) => {
                if (result) {
                    this.quartierIdData.set(result);
                }
            });
        }
    });
});
editTmpl.onCreated(function () {

    this.subUserReady = new ReactiveVar(false);
    this.districtCodeData = new ReactiveVar([]);
    this.districtCode = new ReactiveVar();
    this.quartierIdData = new ReactiveVar([]);
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.districtCodeData.set(result);
        }
    });
    this.autorun(() => {

        let districtCodeId = this.districtCode.get();
        districtCodeId = districtCodeId ? districtCodeId : this.data.districtCode;
        if (districtCodeId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtCodeId, (err, result) => {
                if (result) {
                    this.quartierIdData.set(result);
                }
            });
        }
    });

});


//====================================Render==================
indexTmpl.onRendered(function () {
});
addTmpl.onRendered(function () {
});

editTmpl.onRendered(function () {
    $("[name='quartierId']").attr("readonly", "readonly");
    $("[name='districtCode']").attr("readonly", "readonly");

});

//====================================Helper==================
indexTmpl.helpers({
    dataTable() {
        return BlockTabular;
    },
    selector() {
        return {rolesArea: Session.get('area')};
    }
});

addTmpl.helpers({
    collection() {
        return WB_Block;
    },
    districtCodeData() {
        let instance = Template.instance();
        return instance.districtCodeData.get();
    },
    quartierIddata() {
        let instance = Template.instance();
        return instance.quartierIdData.get();
    }
});

editTmpl.helpers({
    collection() {
        return WB_Block;
    },
    data() {

        let id = FlowRouter.getParam('blockId');
        return WB_Block.findOne(id);
    },
    districtCodeData() {
        let instance = Template.instance();
        return instance.districtCodeData.get();
    },
    quartierIddata() {
        let instance = Template.instance();
        return instance.quartierIdData.get();
    }
});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t) {
        let self = this;
        Meteor.call('isBlockHasRelation', self._id, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm(
                        "Block",
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            WB_Block.remove(self._id, function (error) {
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
    'click .add'(event, instance) {
        alertify.block(`<i class="fa fa-plus"></i> Block`, renderTemplate(addTmpl));
    },
    'click .edit'(event, instance) {
        let self = this;
        alertify.block(`<i class="fa fa-edit"></i> Block`, renderTemplate(editTmpl, self));
    }
    /* 'click .add' (event, instance) {
     FlowRouter.go(`/wb-setting/block/add`);
     },
     'click .edit' (event, instance) {
     FlowRouter.go(`/wb-setting/block/${this._id}/edit`);
     }*/
});

addTmpl.events({
    'change [name="districtCode"]'(event, instance) {
        instance.districtCode.set(event.currentTarget.value);
    }
});

editTmpl.events({
    'change [name="districtCode"]'(event, instance) {
        instance.districtCode.set(event.currentTarget.value);
    }
});


//====================================Destroy=================
indexTmpl.onDestroyed(function () {
});
addTmpl.onDestroyed(function () {
});
editTmpl.onDestroyed(function () {
    $("[name='quartierId']").removeAttr('readonly');
    $("[name='districtCode']").removeAttr('readonly');
});
//====================================Hook====================
AutoForm.hooks({
    wb_blockAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            clearSelect2($("[name='districtCode']"));
            clearSelect2($("[name='quartierId']"));
            alertify.success("Successful")
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    wb_blockEdit: {
        onSuccess: function (formType, result) {
            alertify.success("Successful");
            alertify.block().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});


