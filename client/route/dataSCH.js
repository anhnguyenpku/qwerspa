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

import "../../imports/ui/sch_major/sch_major";
//Student
schData.route('/schMajor', {
    name: 'sch.major',
    title: "Major",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_major');
    }
});
import "../../imports/ui/sch_subject/sch_subject";
//Student
schData.route('/schSubject', {
    name: 'sch.subject',
    title: "Subject",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_subject');
    }
});
import "../../imports/ui/sch_ciriculumn/sch_ciriculumn";
//Student
schData.route('/schCiriculumn', {
    name: 'sch.ciriculumn',
    title: "Ciriculumn",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_ciriculumn');
    }
});

