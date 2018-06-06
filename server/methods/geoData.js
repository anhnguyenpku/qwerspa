import {Meteor} from 'meteor/meteor';

import {Manage_Module} from "./../../imports/collection/manageModule";

Meteor.methods({
    fetchProvinces() {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        let provinces = JSON.parse(Assets.getText('geoData/province.json'));

        let manageModule = Manage_Module.findOne({});
        if (manageModule && manageModule.rolesBranch && manageModule.rolesBranch.length > 0) {
            provinces.forEach(function (province) {
                if (manageModule.rolesBranch.indexOf(province.properties.ADMIN_ID1) > -1) {
                    list.push({
                        label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                        value: `${province.properties.ADMIN_ID1}`
                    });
                }
            });
        } else {
            provinces.forEach(function (province) {
                list.push({
                    label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                    value: `${province.properties.ADMIN_ID1}`
                });
            });
        }
        return list;
    },
    fetchDistricts(adminId1) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        let districts = JSON.parse(Assets.getText('geoData/district.json'));


        let manageModule = Manage_Module.findOne({});
        if (manageModule && manageModule.rolesArea && manageModule.rolesArea.length > 0) {
            districts.map(function (o) {
                if (o.properties.ADMIN_ID1 == adminId1) {
                    if (manageModule.rolesArea.indexOf(o.properties.ADMIN_ID2) > -1) {

                        list.push({
                            label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                            value: `${o.properties.ADMIN_ID2}`
                        });
                    }
                }
            });
        } else {
            districts.map(function (o) {
                if (o.properties.ADMIN_ID1 == adminId1) {
                    list.push({
                        label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                        value: `${o.properties.ADMIN_ID2}`
                    });
                }
            });
        }
        return list;
    },
    fetchDistrictsByProvinceList(adminId1) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/district.json'));
        districts.map(function (o) {
            if (adminId1.indexOf(o.properties.ADMIN_ID1) > -1) {
                list.push({
                    label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                    value: `${o.properties.ADMIN_ID2}`
                });
            }
        });
        return list;
    },
    fetchCommunes(adminId2) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        let communes = JSON.parse(Assets.getText('geoData/commune.json'));
        communes.map(function (o) {
            if (o.properties.ADMIN_ID2 == adminId2) {
                list.push({
                    label: `${o.properties.ADMIN_ID3} | ${o.properties.NAME3}`,
                    value: `${o.properties.ADMIN_ID3}`
                });
            }
        });
        return list;
    },
    fetchVillages(adminId3) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        let communes = JSON.parse(Assets.getText('geoData/village.json'));
        communes.map(function (o) {
            if (o.properties.ADMIN_ID3 == adminId3) {
                list.push({label: `${o.properties.NAME}`, value: `${o.properties.ADMIN_ID}`});
            }
        });
        return list;
    },
    fetchRolesBranch(userId) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            let provinces = JSON.parse(Assets.getText('geoData/province.json'));
            let currentUser = Meteor.users.findOne(userId || Meteor.userId());
            if (!userId || currentUser && currentUser.username == 'super') {
                provinces.forEach(function (province) {
                    list.push({label: `${province.properties.NAME1}`, value: `${province.properties.ADMIN_ID1}`});
                });
            } else {
                if (currentUser) {
                    let province = provinces.find(o => o.properties.ADMIN_ID1 == currentUser.rolesBranch);
                    if (province) {
                        list.push({label: `${province.properties.NAME1}`, value: `${province.properties.ADMIN_ID1}}`});
                    }
                }
            }
        }
        return list;
    },
    fetchRolesArea(userId, adminId1) {
        let list = [];
        list.push({label: '(Please Choose)', value: ''});
        if (Meteor.userId()) {
            let districts = JSON.parse(Assets.getText('geoData/district.json'));
            let currentUser = Meteor.users.findOne(userId || Meteor.userId());
            if (!userId || currentUser && currentUser.username == 'super') {
                districts.map(function (o) {
                    if (adminId1) {
                        if (o.properties.ADMIN_ID1 == adminId1) {
                            list.push({label: `${o.properties.NAME2}`, value: `${o.properties.ADMIN_ID2}`});
                        }
                    }
                });
            } else {
                let geoDistrict = currentUser.rolesArea;
                geoDistrict.forEach(function (elem) {
                    let geoDistrictObj = districts.find(o => o.properties.ADMIN_ID2 == elem);
                    if (geoDistrictObj) {
                        list.push({
                            label: `${geoDistrictObj.properties.NAME2}`,
                            value: `${geoDistrictObj.properties.ADMIN_ID2}`
                        });
                    }
                });
            }

        }
        return list;
    },
    fetchProvincesManageModule() {
        let list = [];
        let provinces = JSON.parse(Assets.getText('geoData/province.json'));
        provinces.forEach(function (province) {
            list.push({
                label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                value: `${province.properties.ADMIN_ID1}`
            });
        });
        return list;
    }
});