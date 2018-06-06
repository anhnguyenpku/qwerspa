
//Collection
import {WB_CustomerType} from '../../imports/collection/customerType'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const CustomerTypeTabular = new Tabular.Table({
    name: "wb.customerTypeTabular",
    collection: WB_CustomerType,
    columnDefs: [
        {"width": "10px", "targets": 3}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "code", title: "Code"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});