import {Acc_ChartAccount} from '../../imports/collection/accChartAccount';
import {Acc_AccountType} from '../../imports/collection/accAccountType';
import {Acc_Exchange} from '../../imports/collection/accExchange';
import {Pos_Location} from '../../imports/collection/posLocation';

import {SpaceChar} from "../../both/config.js/space"

Meteor.methods({
    queryAccountTypeOptionReport() {
        let data = {};
        let list = [];
        let listWithId = [];
        let accountType = Acc_AccountType.find().fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
            listWithId.push(obj._id);
        });

        data.list = list;
        data.listWithId = listWithId;
        return data;
    },
    queryParentChartAccountOptionReport(selector) {

        return Acc_ChartAccount.find(selector, {sort: {code: 1}}).fetch().map(function (obj) {
            return {
                label: SpaceChar.space(obj.level * 6) + obj.code + " | " + obj.name,
                value: obj._id,
            }
        })

    },
    queryChartAccountOptionReport(selector) {
        let list = [];
        Acc_ChartAccount.find(selector, {sort: {code: 1}}).fetch().forEach(function (obj) {
            let subAccountOfDoc = Acc_ChartAccount.findOne({subAccountOf: obj._id});
            let valDisable = false;
            if (subAccountOfDoc) {
                valDisable = true;
            }
            list.push({
                label: SpaceChar.space(obj.level * 6) + obj.code + " | " + obj.name,
                value: obj._id,
                disabled: valDisable
            })
        })
        return list;
    },
    queryExchangeOptionReport() {
        let list = [];
        let selector = {};
        Acc_Exchange.find(selector, {sort: {exDate: -1}}, {limit: 120}).fetch().forEach(function (obj) {
            list.push({
                label: moment(obj.exDate).format("DD/MM/YYYY") + " : " + JSON.stringify(obj.rates),
                value: obj._id
            })
        })
        return list;
    },
    queryRoleBranchOptionReport() {
        let list = [];
        let provinces = JSON.parse(Assets.getText('geoData/province.json'));
        provinces.forEach(function (province) {
            list.push({
                label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                value: `${province.properties.ADMIN_ID1}`
            });
        });
        return list;
    },
    queryRoleAreaOptionReport(adminId1) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/district.json'));
        districts.map(function (o) {
            if (o.properties.ADMIN_ID1 == adminId1) {
                list.push({
                    label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                    value: `${o.properties.ADMIN_ID2}`
                });
            }
        });
        return list;
    },
    queryLocationOptionReport(rolesArea) {
        let list = [];
        let selector = {};
        selector.rolesArea = rolesArea;
        Pos_Location.find(selector).fetch().forEach(function (obj) {
            list.push({
                label: obj.code + " : " + obj.name,
                value: obj._id
            })
        })
        return list;
    }
});