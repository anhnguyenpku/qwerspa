
//Collection
import {WB_MeterType} from '../../imports/collection/meterType'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const meterTypeTabular = new Tabular.Table({
    name: "wb.meterTypeTabular",
    collection: WB_MeterType,
    columnDefs: [
        {"width": "10px", "targets": 3}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "diameter", title: "Diameter"},
        {data: "unit", title: "Unit"},
        {data: "maintenanceFee", title: "MaintenanceFee"},
        {data: "desc", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }

    ]
});
