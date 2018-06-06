
//Collection
import {Wb_activity} from '../../imports/collection/activity'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const activityTabular = new Tabular.Table({
    name: "wb.activityTabular",
    collection: Wb_activity,
    columnDefs: [
        {"width": "10px", "targets": 3}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "code", title: "Code"},
        {data: "name", title: "Name"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});