import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

//Collection
import {WB_MetersReading} from '../../imports/collection/meterReading';
import {VW_metersReading} from '../../imports/collection/meterReading';

Meteor.isClient && require('../../imports/ui/meterReading/meterReading.html');
Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const MeterReadingTabular = new Tabular.Table({
    name: "wb.meterTabular",
    collection: VW_metersReading,
    columnDefs: [
        // {"width": "10px", "targets": 9}
    ],
    extraFields: ['assignUser'],
    columns: [
        {data: "_id", title: "ID"},
        // {
        //     data: "billingPeriod", title: "Billing Period",
        //     render: function (val, type, doc) {
        //         return moment(val).format("DD/MM/YYYY")
        //     }
        // },
        {
            data: "name", title: "Name"
        },
        {data: "customerTypeDoc.description", title: "Customer Type"},
        {data: "districtDoc.name", title: "District"},
        {data: "quartierDoc.name", title: "Quartier"},
        {data: "blockDoc.name", title: "Block"},
        {data: "categoryDoc.name", title: "Category"},
        {data: "classDoc.name", title: "Class"},
        {data: "position", title: "Position"},
        {data: "operationCodeDoc.name", title: "Operation Code"},

        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});