
//Collection
import {WB_MeterCode} from '../../imports/collection/meterCode'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const MeterCodeTabular = new Tabular.Table({
    name: "wb.meterCodeTabular",
    collection: WB_MeterCode,
    columnDefs: [
        {"width": "10px", "targets": 4}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "code", title: "Code"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});