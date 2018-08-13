//function 
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//template js 


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';

var schData = FlowRouter.group({
    prefix: '/sch-data',
    name: 'schData',
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['super', 'admin', 'data']})) {
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


// home
schData.route('/', {
    name: 'wb.homeData',
    title: "Home",
    action: function (query, params) {
        _Main('wb_home');
    }
});

import "../../imports/ui/sch_student/sch_student";
//Student
schData.route('/schStudent', {
    name: 'sch.student',
    title: "Student",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_student');
    }
});


import '../../imports/ui/report/schTranscript/schTranscript';

schData.route('/schTranscript/print', {
    name: 'sch.schTranscript-print',
    action: function (params, queryParams) {
        BlazeLayout.render('PrintLayout', {printLayout: 'sch_transcriptReport'});
    }

});


import "../../imports/ui/sch_class/sch_class";
//Student
schData.route('/schClass', {
    name: 'sch.class',
    title: "Class",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_class');
    }
});
import "../../imports/ui/sch_teacher/sch_teacher";
//Student
schData.route('/schTeacher', {
    name: 'sch.teacher',
    title: "Teacher",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_teacher');
    }
});

import "../../imports/ui/sch_register/sch_register";
//Student
schData.route('/schRegister', {
    name: 'sch.register',
    title: "Register",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_register');
    }
});

import "../../imports/ui/sch_class/sch_classBoard";
//Student
schData.route('/schClassBoard', {
    name: 'sch.classBoard',
    title: "Class Board",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_classBoard');
    }
});

import "../../imports/ui/sch_payment/schPayment";
//Student
schData.route('/schPayment', {
    name: 'sch.payment',
    title: "Payment",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_payment');
    }
});

import '../../imports/ui/report/schPaymentPrintA4/schPaymentPrintA4';

schData.route('/schPayment/print', {
    name: 'sch.schPayment-print',
    action: function (params, queryParams) {
        BlazeLayout.render('PrintLayout', {printLayout: 'sch_paymentPrintA4Report'});
    }

});


import "../../imports/ui/sch_busRegister/sch_busRegister";
//Student
schData.route('/schBusRegister', {
    name: 'sch.busRegister',
    title: "Bus Register",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_busRegister');
    }
});

import "../../imports/ui/sch_busPayment/schBusPayment";
//Student
schData.route('/schBusPayment', {
    name: 'sch.busPayment',
    title: "Bus Receive Payment",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_busPayment');
    }
});