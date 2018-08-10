//import func
import {CheckRoles} from '../../imports/api/methods/checkRoles';
//import template js here
import '../../imports/ui/home/home';

import '../../client/layout';
import '../../imports/ui/user/userSetting';

import '../../imports/ui/notFound/notFound';


//import layout render
require("materialize-css-meteor");
import {_Main} from '../libs/_renderLayout';
import {_NoHeaderNoSideBar} from '../libs/_renderLayout';

//not found route
FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render('Wb_notFound');
    }
};


var schSetting = FlowRouter.group({
    prefix: '/sch-setting',
    name: 'schSetting',
    title: "Setting",
    triggersEnter: [function (context, redirect) {
        if (!CheckRoles({roles: ['admin', 'setting', 'super']})) {
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

import '../../imports/ui/manage_module/manage_module';

import "../../imports/ui/sch_major/sch_major";
//Student
schSetting.route('/schMajor', {
    name: 'sch.major',
    title: "Major",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_major');
    }
});
import "../../imports/ui/sch_faculty/sch_faculty";
//Student
schSetting.route('/schFaculty', {
    name: 'sch.faculty',
    title: "Faculty",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_faculty');
    }
});

import "../../imports/ui/sch_promotion/sch_promotion";
//Student
schSetting.route('/schPromotion', {
    name: 'sch.promotion',
    title: "Promotion",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_promotion');
    }
});
import "../../imports/ui/sch_level/sch_level";
//Student
schSetting.route('/schLevel', {
    name: 'sch.level',
    title: "Level",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_level');
    }
});

import "../../imports/ui/sch_program/sch_program";
//Student
schSetting.route('/schProgram', {
    name: 'sch.program',
    title: "Program",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_program');
    }
});

import "../../imports/ui/sch_subject/sch_subject";
//Student
schSetting.route('/schSubject', {
    name: 'sch.subject',
    title: "Subject",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_subject');
    }
});
import "../../imports/ui/sch_ciriculumn/sch_ciriculumn";
//Student
schSetting.route('/schCiriculumn', {
    name: 'sch.ciriculumn',
    title: "Ciriculumn",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_ciriculumn');
    }
});
import "../../imports/ui/sch_mention/sch_mention";
//Student
schSetting.route('/schMention', {
    name: 'sch.mention',
    title: "Mention",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_mention');
    }
});
import "../../imports/ui/sch_time/sch_time";
//Student
schSetting.route('/schTime', {
    name: 'sch.time',
    title: "Time",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_time');
    }
});
import "../../imports/ui/sch_busStop/sch_busStop";
//Student
schSetting.route('/schBusStop', {
    name: 'sch.busStop',
    title: "Bus Stop",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_busStop');
    }
});
import "../../imports/ui/sch_bus/sch_bus";
//Student
schSetting.route('/schBus', {
    name: 'sch.bus',
    title: "Bus",
    parent: "wb.home",
    action: function (query, params) {
        _Main('sch_bus');
    }
});
