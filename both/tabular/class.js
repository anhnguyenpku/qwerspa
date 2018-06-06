//Collection
import {WB_Class,VW_Class} from '../../imports/collection/class'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const ClassTabular = new Tabular.Table({
    name: "wb.classTabular",
    collection: VW_Class,
    columnDefs: [
        {"width": "10px", "targets": 5}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "categoryDoc.code", title: "category"},
        {data: "code", title: "Code"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        },
    ],
    extraFields: ['categoryId']
});
