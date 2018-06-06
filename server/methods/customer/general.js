import {Meteor} from 'meteor/meteor';
import {WB_District} from '../../../imports/collection/district';
import {WB_Quartier} from '../../../imports/collection/quartier';
import {WB_Block} from '../../../imports/collection/block';
import {WB_Class} from '../../../imports/collection/class';
import {WB_Category} from '../../../imports/collection/category';
import {WB_CustomerType} from '../../../imports/collection/customerType';
import {WB_Customer} from '../../../imports/collection/customer';
import {WB_OperationCode} from '../../../imports/collection/operationCode';
import {WB_Reference} from '../../../imports/collection/reference';
import {Transaction} from '../../../imports/collection/transaction';
import {WB_Agent} from '../../../imports/collection/agent';
import {WB_waterBillingSetup} from '/imports/collection/waterBillingSetup.js';

Meteor.methods({
    fetchGeneralAgentData({rolesArea}) {
        if (Meteor.userId()) {
            let agents = WB_Agent.find({rolesArea: rolesArea}).fetch();
            let list = [];
            list.push({label: '(Please Choose)', value: ''});
            agents.forEach(function (agent) {
                list.push({label: `${agent.name}`, value: agent._id});
            });
            return list;
        }
    },
    fetchGeneralDistrictData({rolesArea}) {
        if (Meteor.userId()) {
            let districts = WB_District.find({rolesArea: rolesArea}).fetch();
            let list = [{label:"All",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            districts.forEach(function (district) {
                list.push({label: `${district.code} | ${district.name}`, value: district._id});
            });
            return list;
        }
    },
    fetchGeneralDistrictDataOne({rolesArea}) {
        if (Meteor.userId()) {
            let districts = WB_District.find({rolesArea: rolesArea}).fetch();
            let list = [{label:"Select One",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            districts.forEach(function (district) {
                list.push({label: `${district.code} | ${district.name}`, value: district._id});
            });
            return list;
        }
    },
    fetchQuartierByDistrictCodeId(districtCodeId) {
        if (Meteor.userId()) {
            let quartiers = WB_Quartier.find({districtCodeId: districtCodeId}).fetch();
            let list = [{label:"All",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            quartiers.forEach(function (quartier) {
                list.push(
                    {
                        label: `${quartier.code} | ${quartier.name}`,
                        value: quartier._id
                    }
                );
            });
            return list;
        }
    },
    fetchQuartierByDistrictCodeIdOne(districtCodeId) {
        if (Meteor.userId()) {
            let quartiers = WB_Quartier.find({districtCodeId: districtCodeId}).fetch();
            let list = [{label:"Select One",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            quartiers.forEach(function (quartier) {
                list.push(
                    {
                        label: `${quartier.code} | ${quartier.name}`,
                        value: quartier._id
                    }
                );
            });
            return list;
        }
    },
    fetchBlockByQuartierCode(quartierId) {
        if (Meteor.userId()) {
            let blocks = WB_Block.find({quartierId: quartierId}).fetch();
            let list = [{label:"All",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            blocks.forEach(function (block) {
                list.push({label: `${block.code} | ${block.name}`, value: block._id});
            });
            return list;
        }
    },
    fetchBlockByQuartierCodeOne(quartierId) {
        if (Meteor.userId()) {
            let blocks = WB_Block.find({quartierId: quartierId}).fetch();
            let list = [{label:"Select One",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            blocks.forEach(function (block) {
                list.push({label: `${block.code} | ${block.name}`, value: block._id});
            });
            return list;
        }
    },
    fetchCategoryData() {
        if (Meteor.userId()) {
            let categories = WB_Category.find({}).fetch();
            let list = [{label:"All",value:''}];
            // list.push({label: '(Please Choose)', value: ''});
            categories.forEach(function (category) {
                list.push({label: `${category.code} | ${category.name}`, value: category._id});
            });
            return list;
        }
    },
    fetchUserCashierData() {
        if (Meteor.userId()) {
            let users = Meteor.users.find({'roles.wb':{$in:['payment']}}).fetch();
            let list = [];
            // list.push({label: '(Please Choose)', value: ''});
            users.forEach(function (user) {
                list.push({label: `${user.fullName}`, value: user._id});
            });
            return list;
        }
    },
    fetchClassData() {
        if (Meteor.userId()) {
            let classData = WB_Class.find({}).fetch();
            let list = [];
            // list.push({label: '(Please Choose)', value: ''});
            classData.forEach(function (data) {
                list.push({label: `${data.code} | ${data.name}`, value: data._id});
            });
            return list;
        }
    },
    fetchClassDataByCategoryId(categoryId){
        if (Meteor.userId()) {
            let list = [];
            let classData = WB_Class.find({categoryId: categoryId}).fetch();
            classData.forEach(function (data) {
                list.push({label: `${data.code} | ${data.name}`, value: data._id});
            });
            return list;
        }
    },
    fetchCustomerTypeData() {
        if (Meteor.userId()) {
            let customerTypeData = WB_CustomerType.find({}).fetch();
            let list = [];
            list.push({label: '(Please Choose)', value: ''});
            customerTypeData.forEach(function (data) {
                list.push({label: `${data.code} | ${data.description}`, value: data._id});
            });
            return list;
        }
    },
    fetchOperationCodeData() {
        if (Meteor.userId()) {
            let operationCodeData = WB_OperationCode.find({}).fetch();
            let list = [];
            // list.push({label: '(Please Choose)', value: ''});
            operationCodeData.forEach(function (data) {
                list.push({label: `${data.code} | ${data.name}`, value: data._id});
            });
            return list;
        }
    },
    fetchReference() {
        if (Meteor.userId()) {
            return WB_Reference.find({}).fetch();
        }
    },
    getCustomerById({_id}) {
        return WB_Customer.findOne({_id});
    },
    fetchBlock() {
        if (Meteor.userId()) {
            let blocks = WB_Block.find({}).fetch();
            let list = [];
            list.push({label: '(Please Choose)', value: ''});
            blocks.forEach(function (block) {
                list.push({label: `${block.code} | ${block.name}`, value: block._id});
            });
            return list;
        }
    },
    giveMeTransactionBalanceObj({customerId}) {
        return Transaction.findOne({customerId});
    },
    generateDPC(doc){
        let district = WB_District.findOne({_id: doc.district});
        let quartier = WB_Quartier.findOne({_id: doc.quartier});
        let block = WB_Block.findOne({_id: doc.block});
        return district.code + quartier.code + block.code + doc.folio + doc.successor;
    }
});