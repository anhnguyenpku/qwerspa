
//Collection
import {WB_Agent} from '../../imports/collection/agent'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const AgentTabular = new Tabular.Table({
    name: "wb.agentTabular",
    collection: WB_Agent,
    columnDefs: [
        {"width": "10px", "targets": 4}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "name", title: "Name"},
        {data: "phone", title: "Phone"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});