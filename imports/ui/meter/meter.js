import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
//Import Page
import './meter.html';


//import Collection
import {WB_Meters} from '../../collection/meter';

//Tabular
import Meter from '/imports/vue/ui/Meter.vue';

let indexTmpl = Template.wb_meter;

indexTmpl.onRendered(function () {
    new Vue({
       render: h => h(Meter)
    }).$mount('meter');
});

indexTmpl.onDestroyed(function () {
    $(".meter").remove();
});