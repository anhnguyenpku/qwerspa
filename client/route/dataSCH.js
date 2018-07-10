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
import "../../imports/ui/sch_mention/sch_mention";
//Student
schData.route('/schMention', {
    name: 'sch.mention',
    title: "Mention",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_mention');
    }
});


import '../../imports/ui/report/schTranscript/schTranscript';

schData.route('/schTranscript/print', {
    name: 'sch.schTranscript-print',
    action: function (params, queryParams) {
        BlazeLayout.render('PrintLayout', {printLayout: 'sch_transcriptReport'});
    }

});


import "../../imports/ui/sch_level/sch_level";
//Student
schData.route('/schLevel', {
    name: 'sch.level',
    title: "Level",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_level');
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
import "../../imports/ui/sch_program/sch_program";
//Student
schData.route('/schProgram', {
    name: 'sch.program',
    title: "Program",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_program');
    }
});
