
import {Accounts} from 'meteor/accounts-base'


Meteor.startup(function () {

    // Enable cross origin requests for all endpoints
    JsonRoutes.setResponseHeaders({
        "content-type": "application/json; charset=utf-8"
    });
    JsonRoutes.setResponseHeaders({
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    });

    JsonRoutes.add("get", "/api_fetchProducts", function (req, res, next) {
        res.charset = "utf-8";
        let doc = Meteor.call("api_fetchProduct", {name: "", color: ""});
        return JsonRoutes.sendResult(res, {
            data: doc
        });
    });

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