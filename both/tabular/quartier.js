
//Collection
import {WB_Quartier,VW_Quartier} from '../../imports/collection/quartier'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');
Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const QuartierTabular = new Tabular.Table({
    name: "wb.quartierTabular",
    collection: VW_Quartier,
    columnDefs: [
        {"width": "10px", "targets": 4}
    ],
    columns: [
       // {data: "_id", title: "No"},
        {data: "districtDoc.code", title: "District"},
        {data: "code", title: "Quartier Code"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ],
    extraFields: ["districtCodeId"]
});