/*
import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from 'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';

//Import Page
import './changeBlock.html';


//import Collection
import {WB_ChangeBlock} from '../../collection/changeBlock';

//Tabular
import {ChangeBlockTabular} from '../../../both/tabular/changeBlock';
import {createNewAlertify} from "../../../client/libs/create-alertify";
import {renderTemplate} from "../../../client/libs/render-template";


let indexTmpl = Template.wb_changeBlock,
    addTmpl = Template.wb_changeBlockAdd,
    editTmpl = Template.wb_changeBlockEdit;


//====================================State===================
var customerOpt = new ReactiveVar([]);
var customerBlock = new ReactiveVar();
var blockOpt = new ReactiveVar([]);
var customerByBlockOpt = new ReactiveVar([]);
var changeToBlockId = new ReactiveVar();

let customerName = new ReactiveVar();
let customerIdSelect = new ReactiveVar();
//====================================Create==================

indexTmpl.onCreated(function () {
    let customerId = FlowRouter.getParam('customerId');
    customerIdSelect.set(customerId);


    Meteor.call("getCustomerById", {_id: customerId}, (err, result) => {
        if (!err) {
            customerName.set(result._id + " | " + result.khName);
            customerBlock.set(result.block);

        }
    })

});
addTmpl.onCreated(function () {
    let customerId = FlowRouter.getParam('customerId');

    Meteor.call("fetchBlock", (err, result) => {
        if (result) {
            blockOpt.set(result);
        }
    });

    this.autorun(() => {
        /!*Meteor.call('wp_fetchCustomer', (err, result) => {
         if (result) {
         customerOpt.set(result);
         }
         });*!/
        Meteor.call("wp_fetchCustomerByBlock", changeToBlockId.get(), (err, result) => {
            customerByBlockOpt.set(result);
        })

        Meteor.call("getCustomerById", {_id: customerId}, (err, result) => {
            if (!err) {
                customerName.set(result._id + " | " + result.khName);
                customerBlock.set(result.block);

            }
        })
    })

});
editTmpl.onCreated(function () {
    /!*Meteor.call('wp_fetchCustomer', (err, result) => {
     if (result) {
     customerOpt.set(result);
     }
     });*!/

    Meteor.call("fetchBlock", (err, result) => {
        if (result) {
            blockOpt.set(result);
        }
    });

});


//====================================Render==================
indexTmpl.onRendered(function () {
    createNewAlertify("changeBlock", {size: "md"});
});

addTmpl.onRendered(function () {

});

editTmpl.onRendered(function () {
    this.autorun(() => {
        if (changeToBlockId.get()) {
            Meteor.call("wp_fetchCustomerByBlock", changeToBlockId.get(), (err, result) => {
                customerByBlockOpt.set(result);
            })
        }
    });
});

//====================================Helper==================
indexTmpl.helpers({
    selector() {
        return {rolesArea: Session.get('area'), customerId: customerIdSelect.get()}
    },
    dataTable() {
        return ChangeBlockTabular;
    },
    customerName() {
        return customerName.get();
    }
});

addTmpl.helpers({
    collection() {
        return WB_ChangeBlock;
    },
    customerOption() {

        return customerOpt.get();
    },
    customerBlock() {
        return customerBlock.get();
    },
    blockOption() {
        return blockOpt.get();
    },
    customerByBlockOption() {

        return customerByBlockOpt.get();
    },
    customerId() {
        return customerIdSelect.get();
    }
});

editTmpl.helpers({

    collection() {
        return WB_ChangeBlock;
    },
    collection() {
        return WB_ChangeBlock;
    },
    customerOption() {
        return customerOpt.get();
    },
    customerBlock() {
        return customerBlock.get();
    },
    blockOption() {
        return blockOpt.get();
    },
    customerByBlockOption() {
        return customerByBlockOpt.get();
    }

});


//====================================Event===================
indexTmpl.events({
    'click .remove'(e, t) {
        var self = this;
        alertify.confirm(
            "ChangeBlock",
            "Are you sure to delete [" + self._id + "]?",
            function () {
                WB_ChangeBlock.remove(self._id, function (error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null
        );
    },
    'click .add'(event, instance) {
        alertify.changeBlock(`<i class="fa fa-plus"></i> Change Block`, renderTemplate(addTmpl));
    },
    'click .edit'(event, instance) {
        debugger;
        let self = this;
        customerBlock.set(self.block);
        changeToBlockId.set(self.changeToBlock);
        alertify.changeBlock(`<i class="fa fa-edit"></i> Change Block`, renderTemplate(editTmpl, self));
    }
})

addTmpl.events({
    'change [name="customerId"]'(e, t) {
        let customerId = e.currentTarget.value;
        Meteor.call("getCustomerById", {_id: customerId}, function (er, result) {
            if (result) {
                customerBlock.set(result.block);
            }
        })

    },
    'change [name="changeToBlock"]'(e, t) {
        debugger;
        let blockId = e.currentTarget.value;
        changeToBlockId.set(blockId);
    }
})

editTmpl.events({
    'change [name="customerId"]'(e, t) {
        let customerId = e.currentTarget.value;
        Meteor.call("getCustomerById", {_id: customerId}, function (er, result) {
            if (result) {
                customerBlock.set(result.block);
            }
        })
    },
    'change [name="changeToBlock"]'(e, t) {
        let blockId = e.currentTarget.value;
        changeToBlockId.set(blockId);
    }
})


//====================================Destroy=================
indexTmpl.onDestroyed(function () {


})

addTmpl.onDestroyed(function () {

    customerOpt.set([]);
    customerBlock.set("");
    blockOpt.set([]);
    customerByBlockOpt.set([]);
    changeToBlockId.set(undefined);
})

editTmpl.onDestroyed(function () {
    debugger;
    customerOpt.set([]);
    customerBlock.set("");
    blockOpt.set([]);
    customerByBlockOpt.set([]);
    changeToBlockId.set(undefined);
})


//====================================Hook====================
AutoForm.hooks({
    wb_changeBlockAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get("area");
                return doc;
            }
        },
        onSuccess: function (formType, result) {

            alertify.success("Success");
            alertify.changeBlock().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);

        }
    },
    wb_changeBlockEdit: {
        before: {
            update: function (doc) {
                debugger;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success("Success");
            alertify.changeBlock().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
})*/
