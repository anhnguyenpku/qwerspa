//function
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js

// import '../../imports/ui/report/journal/journal';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';
import {_NoHeaderNoSideBar} from '../libs/_renderLayout';

let schReport = FlowRouter.group({
    prefix: '/sch-report',
    name: 'schReport',
    title: "Home",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'super', 'report']})) {
            redirect('wb.home');
        }

        if (!CheckRoles({roles: ['remove', 'super']})) {
            Session.set("canRemove", true);
        } else {
            Session.set("canRemove", false);
        }
        if (!CheckRoles({roles: ['update', 'super']})) {
            Session.set("canUpdate", true);
        } else {
            Session.set("canUpdate", false);
        }
    }]
});

let schReportStudent = FlowRouter.group({
    prefix: '/sch-report',
    name: 'schReport',
    title: "Home",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'super', 'reportVendor']})) {
            redirect('wb.home');
        }

        if (!CheckRoles({roles: ['remove', 'super']})) {
            Session.set("canRemove", true);
        } else {
            Session.set("canRemove", false);
        }
        if (!CheckRoles({roles: ['update', 'super']})) {
            Session.set("canUpdate", true);
        } else {
            Session.set("canUpdate", false);
        }
    }]
});


let schReportNewPage = FlowRouter.group({
    prefix: '/sch-report',
    name: 'schReport',
    title: "Home"/*,
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
            redirect('wb.home');
        }
    }]*/
});


import '../../imports/ui/report/schRegister/schRegister';

schReportStudent.route('/schRegisterReport', {
    name: 'sch.schRegisterReport',
    title: "Register Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_registerReport');
    }

});
import '../../imports/ui/report/schPayment/schPayment';

schReportStudent.route('/schPaymentReport', {
    name: 'sch.schPaymentReport',
    title: "Payment Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_paymentReport');
    }

});
import '../../imports/ui/report/schDebtSummary/schDebtSummary';

schReportStudent.route('/schDebtSummaryReport', {
    name: 'sch.schDebtSummaryReport',
    title: "Debt Summary Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_debtSummaryReport');
    }

});
import '../../imports/ui/report/schDebtDetail/schDebtDetail';

schReportStudent.route('/schDebtDetailReport', {
    name: 'sch.schDebtDetailReport',
    title: "Debt Detail Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_debtDetailReport');
    }

});
import '../../imports/ui/report/schStudentList/schStudentList';

schReportStudent.route('/schStudentListReport', {
    name: 'sch.schStudentListReport',
    title: "Student List Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_studentListReport');
    }

});

import '../../imports/ui/report/schBusRegister/schBusRegister';

schReportStudent.route('/schBusRegisterReport', {
    name: 'sch.schBusRegisterReport',
    title: "Bus Register Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_busRegisterReport');
    }

});
import '../../imports/ui/report/schBusRegisterActive/schBusRegisterActive';

schReportStudent.route('/schBusRegisterActiveReport', {
    name: 'sch.schBusRegisterActiveReport',
    title: "Bus Register Active Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_busRegisterActiveReport');
    }

});

import '../../imports/ui/report/schBusPayment/schBusPayment';

schReportStudent.route('/schBusPaymentReport', {
    name: 'sch.schBusPaymentReport',
    title: "Bus Payment Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_busPaymentReport');
    }

});

import '../../imports/ui/report/schBusDebtDetail/schBusDebtDetail';

schReportStudent.route('/schBusDebtDetailReport', {
    name: 'sch.schBusDebtDetailReport',
    title: "Bus Debt Detail Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_busDebtDetailReport');
    }

});

import '../../imports/ui/report/schBusDebtSummary/schBusDebtSummary';

schReportStudent.route('/schBusDebtSummaryReport', {
    name: 'sch.schBusDebtSummaryReport',
    title: "Bus Debt Summary Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_busDebtSummaryReport');
    }

});

import '../../imports/ui/report/schTeacherActivity/schTeacherActivity';

schReportStudent.route('/schTeacherActivityReport', {
    name: 'sch.schTeacherActivityReport',
    title: "Teacher Activity Report",
    parent: 'wb.home',
    action: function (query, params) {
        _Main('sch_teacherActivityReport');
    }

});
