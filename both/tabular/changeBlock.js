//Collection
import {WB_ChangeBlock} from '../../imports/collection/changeBlock'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const ChangeBlockTabular = new Tabular.Table({
    name: "wb.changeBLockTabular",
    collection: WB_ChangeBlock,
    columnDefs: [
        {"width": "10px", "targets": 5}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "customerBlock", title: "Block"},
        {data: "customerId", title: "Customer"},
        {data: "changeToBlock", title: "Change To Block"},
        {data: "changeToNearCustomer", title: "Near Customer"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});