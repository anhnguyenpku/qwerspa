import {Template} from 'meteor/templating'
import {AutoForm} from 'meteor/aldeed:autoform'
import {Roles} from 'meteor/alanning:roles'
import {alertify} from 'meteor/ovcharik:alertifyjs'
// import {clearSelect2} from '../../../client/libs/clear-select';
//imort customer detail page
import CustomerDetail from '/imports/vue/components/customer/customerDetail.vue';
// Import Page
import './customer.html'

// import Collection
import {WB_Customer} from '../../collection/customer'

// Tabular
// import {CustomerTabular} from '../../../both/tabular/customer'

let indexTmpl = Template.wb_customer,
    addTmpl = Template.wb_customerAdd,
    editTmpl = Template.wb_customerEdit;
detailTmpl = Template.wb_customerDetail;

// ====================================State===================

// ====================================Create==================

indexTmpl.onCreated(function () {
});
addTmpl.onCreated(function () {
    this.provinceId = new ReactiveVar();
    this.districtId = new ReactiveVar();
    this.communeId = new ReactiveVar();
    this.quartierId = new ReactiveVar();
    this.provinceData = new ReactiveVar([]);
    this.districtData = new ReactiveVar([]);
    this.communeData = new ReactiveVar([]);
    this.villageData = new ReactiveVar([]);
    this.quartierData = new ReactiveVar([]);
    this.blockData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.operationCodeData = new ReactiveVar([]);
    this.generalDistrictData = new ReactiveVar([]);
    this.activityData = new ReactiveVar([]);
    this.districtCodeId = new ReactiveVar();
    this.categoryId = new ReactiveVar();
    Meteor.subscribe('wb_meterTypePub');
    Meteor.subscribe('wb_meterCodePub');
    Meteor.call('fetchActivityData', (err, result) => {
        if (result) {
            this.activityData.set(result);
        }
    });
    Meteor.call('fetchOperationCodeData', (err, result) => {
        if (result) {
            this.operationCodeData.set(result);
        }
    });

    Meteor.call('fetchProvinces', (err, result) => {
        if (result) {
            this.provinceData.set(result);
        }
    });
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.generalDistrictData.set(result);
        }
    });
    this.autorun(() => {
        let categoryId = this.categoryId.get();
        let provinceId = this.provinceId.get();
        let districtId = this.districtId.get();
        let communeId = this.communeId.get();
        let quartierId = this.quartierId.get();
        let districtCodeId = this.districtCodeId.get();
        if (categoryId) {
            Meteor.call('fetchClassDataByCategoryId', categoryId, (err, result) => {
                if (result) {
                    this.classData.set(result);
                }
            });
        }

        if (districtCodeId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtCodeId, (err, result) => {
                if (result) {
                    this.quartierData.set(result);
                }
            });
        }
        /* if (quartierId) {
         Meteor.call('fetchBlockByQuartierCode', quartierId, (err, result) => {
         if (result) {
         this.blockData.set(result);
         }
         });
         }*/
    })
});
editTmpl.onCreated(function () {
    this.subUserReady = new ReactiveVar(false);
    this.provinceId = new ReactiveVar();
    this.districtId = new ReactiveVar();
    this.communeId = new ReactiveVar();
    this.villageId = new ReactiveVar();
    this.quartierId = new ReactiveVar();
    this.provinceData = new ReactiveVar([]);
    this.districtData = new ReactiveVar([]);
    this.communeData = new ReactiveVar([]);
    this.villageData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.categoryData = new ReactiveVar([]);
    this.operationCodeData = new ReactiveVar([]);
    this.quartierData = new ReactiveVar([]);
    this.blockData = new ReactiveVar([]);
    this.classData = new ReactiveVar([]);
    this.categoryData = new ReactiveVar([]);
    this.generalDistrictData = new ReactiveVar([]);
    this.activityData = new ReactiveVar([]);
    this.districtCodeId = new ReactiveVar();
    this.categoryId = new ReactiveVar();
    Meteor.subscribe('wb_meterTypePub');
    Meteor.subscribe('wb_meterCodePub');
    Meteor.call('fetchActivityData', (err, result) => {
        if (result) {
            this.activityData.set(result);
        }
    });
    this.autorun(() => {
        let id = FlowRouter.getParam('customerId');
        if (id) {
            this.subscription = Meteor.subscribe('wb_customerById', {_id: id});
        }
    });
    Meteor.call('fetchOperationCodeData', (err, result) => {
        if (result) {
            this.operationCodeData.set(result);
        }
    });

    Meteor.call('fetchProvinces', (err, result) => {
        if (result) {
            this.provinceData.set(result);
        }
    });
    Meteor.call('fetchGeneralDistrictData', {rolesArea: Session.get('area')}, (err, result) => {
        if (result) {
            this.generalDistrictData.set(result);
        }
    });
    this.autorun(() => {
        let provinceId = this.provinceId.get();
        let districtId = this.districtId.get();
        let communeId = this.communeId.get();
        let quartierId = this.quartierId.get();
        let districtCodeId = this.districtCodeId.get();
        let categoryId = this.categoryId.get();
        if (categoryId) {
            Meteor.call('fetchClassDataByCategoryId', categoryId, (err, result) => {
                if (!err) {
                    this.classData.set(result);
                }
            });
        }

        if (districtCodeId) {
            Meteor.call('fetchQuartierByDistrictCodeId', districtCodeId, (err, result) => {
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
        if (provinceId) {
            //get district
            Meteor.call('fetchDistricts', provinceId, (err, result) => {
                if (result) {
                    this.districtData.set(result);
                } else {
                    console.log(err.message);
                }
            });
        }
        if (districtId) {
            //get commune
            Meteor.call('fetchCommunes', districtId, (err, result) => {
                if (result) {
                    this.communeData.set(result);
                } else {
                    console.log(err.message);
                }
            });
        }
        if (communeId) {
            //get village
            Meteor.call('fetchVillages', communeId, (err, result) => {
                if (result) {
                    this.villageData.set(result);
                } else {
                    console.log(err.message);
                }
            });
        }
    })
});

// ====================================Render==================
indexTmpl.onRendered(function () {
});

addTmpl.onRendered(function () {
    // $('.collapsible').collapsible();
    $('[name="district"]').select2();
    $('[name="quartier"]').select2();
    $('[name="block"]').select2();
});

editTmpl.onRendered(function () {
    this.autorun(() => {
        if (this.subscription.ready()) {
            this.subUserReady.set(true);
            Meteor.setTimeout(function () {
                $('.collapsible').collapsible();
                $('[name="district"]').select2();
                $('[name="quartier"]').select2();
                $('[name="block"]').select2();
            }, 200);
            let id = FlowRouter.getParam('customerId');
            let customer = WB_Customer.findOne(id);
            if (customer) {
                this.provinceId.set(customer.location && customer.location.province);
                this.districtId.set(customer.location && customer.location.district);
                this.communeId.set(customer.location && customer.location.commune);
            }
            if (customer && customer.category) {
                this.categoryId.set(customer.category);
            }
            if (customer && customer.district) {
                this.districtCodeId.set(customer.district);
            }
            if (customer && customer.quartier) {
                this.quartierId.set(customer.quartier);
            }
            if (customer.changeBlock && customer.changeBlock.length > 1) {
                $("[name='district']").attr("readonly", "readonly");
                $("[name='folio']").attr("readonly", "readonly");
                $("[name='quartier']").attr("readonly", "readonly");
                $("[name='successor']").attr("readonly", "readonly");
                $("[name='block']").attr("readonly", "readonly");
            }

        }
    });


});

detailTmpl.onRendered(function () {
    new Vue({
        render: c => c(CustomerDetail)
    }).$mount('customer-detail')
});
detailTmpl.onDestroyed(function () {
    $('.customer-detail').remove();
})

// ====================================Helper==================
indexTmpl.helpers({
    // selector(){
    //     return {rolesArea: Session.get('area')};
    // },
    // dataTable() {
    //     return CustomerTabular
    // }
});

addTmpl.helpers({
    classData() {
        let instance = Template.instance();
        return instance.classData.get();
    },
    operationCodeData() {
        let instance = Template.instance();
        return instance.operationCodeData.get();
    },
    collection() {
        return WB_Customer;
    },
    province() {
        let instance = Template.instance();
        return instance.provinceData.get();
    },
    district() {
        let instance = Template.instance();
        return instance.districtData.get();
    },
    commune() {
        let instance = Template.instance();
        return instance.communeData.get();
    },
    village() {
        let instance = Template.instance();
        return instance.villageData.get();
    },
    generalDistrictData() {
        let instance = Template.instance();
        return instance.generalDistrictData.get();
    },
    quartierData() {
        let instance = Template.instance();
        return instance.quartierData.get();
    },
    blockData() {
        let instance = Template.instance();
        return instance.blockData.get();
    },
    activityData() {
        let instance = Template.instance();
        return instance.activityData.get();
    }
});

editTmpl.helpers({
    classData() {
        let instance = Template.instance();
        return instance.classData.get();
    },
    operationCodeData() {
        let instance = Template.instance();
        return instance.operationCodeData.get();
    },
    subscriptionsReady() {
        let instance = Template.instance();
        return instance.subUserReady.get()
    },
    collection() {
        return WB_Customer
    },
    data() {
        let id = FlowRouter.getParam('customerId');
        return WB_Customer.findOne(id)
    },
    province() {
        let instance = Template.instance();
        return instance.provinceData.get();
    },
    district() {
        let instance = Template.instance();
        return instance.districtData.get();
    },
    commune() {
        let instance = Template.instance();
        return instance.communeData.get();
    },
    village() {
        let instance = Template.instance();
        return instance.villageData.get();
    },
    generalDistrictData() {
        let instance = Template.instance();
        return instance.generalDistrictData.get();
    },
    quartierData() {
        let instance = Template.instance();
        return instance.quartierData.get();
    },
    blockData() {
        let instance = Template.instance();
        return instance.blockData.get();
    },
    activityData() {
        let instance = Template.instance();
        return instance.activityData.get();
    }
});

// ====================================Event===================
indexTmpl.events({
    // 'click .remove'(e, t) {
    //     var self = this;
    //     alertify.confirm(
    //         'Customer Type',
    //         'Are you sure to delete [' + self._id + ']?',
    //         function () {
    //             WB_Customer.remove(self._id, function (error) {
    //                 if (error) {
    //                     // alertify.error(error.message)
    //                     Materialize.toast(error.message, 3000, 'red rounded')
    //                 } else {
    //                     // alertify.success("Success")
    //                     Materialize.toast('Successful', 3000, 'lime accent-4 rounded')
    //                 }
    //             })
    //         },
    //         null
    //     )
    // },
    // 'dblclick tbody > tr'(event, instance) {
    //     let dataTalbe = $(event.currentTarget).closest('table').DataTable();
    //     let rowData = dataTalbe.row(event.currentTarget).data();
    //     FlowRouter.go(`/wb-setting/customer/${rowData._id}/detail`)
    // },
    // 'click .add'(e, t) {
    //     FlowRouter.go(`/wb-setting/customer/add`)
    // },
    // 'click .edit'(e, t) {
    //     let self = this;
    //     FlowRouter.go(`/wb-setting/customer/${self._id}/edit`)
    // }
});

addTmpl.events({
    'click .cancel'(e, t) {
        FlowRouter.go(`/wb-setting/customer`)
    },
    'change [name="location.province"]'(event, instance) {
        let provinceId = $(event.currentTarget).val();
        Meteor.call('fetchDistricts', provinceId, (err, result) => {
            if (result) {
                instance.districtData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="location.district"]'(event, instance) {
        let districtId = $(event.currentTarget).val();
        Meteor.call('fetchCommunes', districtId, (err, result) => {
            if (result) {
                instance.communeData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="location.commune"]'(event, instance) {
        let communeId = $(event.currentTarget).val();
        Meteor.call('fetchVillages', communeId, (err, result) => {
            if (result) {
                instance.villageData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="district"]'(event, instance) {
        instance.districtCodeId.set(event.currentTarget.value);
    },
    'change [name="quartier"]'(event, instance) {
        Meteor.call('fetchBlockByQuartierCode', event.currentTarget.value, (err, result) => {
            if (result) {
                instance.blockData.set(result);
            }
        });
        // instance.quartierId.set(event.currentTarget.value);
    },
    'change [name="category"]'(event, instance) {
        let currentTarget = $(event.currentTarget);
        if (!!currentTarget.val()) {
            instance.categoryId.set(currentTarget.val());
        }
    }
});

editTmpl.events({
    'click .cancel'(e, t) {
        FlowRouter.go(`/wb-setting/customer`)
    },
    'change [name="location.province"]'(event, instance) {
        let provinceId = $(event.currentTarget).val();
        Meteor.call('fetchDistricts', provinceId, (err, result) => {
            if (result) {
                instance.districtData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="location.district"]'(event, instance) {
        let districtId = $(event.currentTarget).val();
        Meteor.call('fetchCommunes', districtId, (err, result) => {
            if (result) {
                instance.communeData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="location.commune"]'(event, instance) {
        let communeId = $(event.currentTarget).val();
        Meteor.call('fetchVillages', communeId, (err, result) => {
            if (result) {
                instance.villageData.set(result);
            } else {
                console.log(err.message);
            }
        });
    },
    'change [name="district"]'(event, instance) {
        instance.districtCodeId.set(event.currentTarget.value);
    },
    'change [name="quartier"]'(event, instance) {
        instance.quartierId.set(event.currentTarget.value);
    },
    'change [name="category"]'(event, instance) {
        let currentTarget = $(event.currentTarget);
        if (!!currentTarget.val()) {
            instance.categoryId.set(currentTarget.val());
        }
    }
});


// ====================================Destroy=================
indexTmpl.onDestroyed(function () {
});

addTmpl.onDestroyed(function () {
});

editTmpl.onDestroyed(function () {
    $("[name='district']").removeAttr('readonly');
    $("[name='folio']").removeAttr('readonly');
    $("[name='quartier']").removeAttr('readonly');
    $("[name='successor']").removeAttr('readonly');
    $("[name='block']").removeAttr('readonly');

});

// ====================================Hook====================
AutoForm.hooks({
    wb_customerAdd: {
        before: {
            insert: function (doc) {
                doc.rolesArea = Session.get('area');
                // doc.dpc = subRolesArea(doc.district) + subRolesArea(doc.quartier) + subRolesArea(doc.block) + doc.folio + doc.successor;
                return doc;
            }
        },
        onSuccess: function (formType, result) {

            alertify.success("Success");
            // clearSelect();
            FlowRouter.go(`/wb-data/customer`);
            FlowRouter.query.unset();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
            FlowRouter.query.unset();
        }
    },
    wb_customerEdit: {
        onSuccess: function (formType, result) {
            FlowRouter.query.unset();
            alertify.success("Updated Success");
            FlowRouter.go(`/wb-data/customer`);
        },
        onError: function (formType, error) {
            FlowRouter.query.unset();

            alertify.error(error.message);
        }
    }
});

// function clearSelect() {
//     clearSelect2($('[name="location.province"]'));
//     clearSelect2($('[name="location.district"]'));
//     clearSelect2($('[name="location.commune"]'));
//     clearSelect2($('[name="location.village"]'));
// }
