import {RefModify} from '../imports/collection/refModify.js';
import {WB_MeterReadingJournalDetail, Wb_meterReadingJournal} from '../imports/collection/meterReadingJournal';
import {WB_Payment} from '../imports/collection/payment';
import {WB_Province} from '../imports/collection/province';
import {WB_RequestCuttingWater} from '../imports/collection/requestCuttingWater';

import {Accounts} from 'meteor/accounts-base'


Meteor.startup(function () {

    /*Accounts.config({
        loginExpirationInDays: (1 / 24 / 60) / 20
    })*/
    //SyncedCron.start();
    if (Meteor.users.find().count() <= 0) {
        let superId = Accounts.createUser({
            username: 'super',
            email: 'super@navi.com',
            password: 'superh2e@123',
            approved: true
        });
    }
    if (WB_Province.find({}).count() <= 0) {
        WB_Province.insert({
            khName: 'បាត់ដំបង',
            enName: 'Battambang',
            khShortName: 'បប',
            enShortName: 'BB',
            code: '02'
        });
    }

//    ensure index
    WB_Payment._ensureIndex({createdBy: 1, date: 1, meterJournalId: 1, rolesArea: 1, paidAmount: 1}, {
        unique: true,
        sparse: 1
    });
    WB_RequestCuttingWater._ensureIndex({rolesArea: 1, journalBookDetailId: 1, blockId: 1, customerId: 1}, {
        unique: true,
        sparse: 1
    });
    WB_MeterReadingJournalDetail._ensureIndex({
        customerId: 1,
        blockId: 1,
        barcode: 1,
        prevReadingDate: 1,
        rolesArea: 1
    }, {unique: true, sparse: true});
    Wb_meterReadingJournal._ensureIndex({meterReadingId: 1, validateDate: 1}, {unique: true});
    RefModify._ensureIndex({'document.meterReadingJournalId': 1, modifiedBy: 1, type: 1, action: 1, modifiedDate: 1});
    // Enable cross origin requests for all endpoints
    JsonRoutes.setResponseHeaders({
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    });
    // Listen to incoming HTTP requests, can only be used on the server
    WebApp.rawConnectHandlers.use("/", function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    });
});