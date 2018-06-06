
//Collection
import {WB_Block,VW_Block} from '../../imports/collection/block';

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const BlockTabular = new Tabular.Table({
    name: "wb.blockTabular",
    collection: VW_Block,
    columnDefs: [
        {"width": "10px", "targets": 5}
    ],
    columns: [
        // {data: "_id", title: "No"},
        {data: "districtDoc.code", title: "District"},
        {data: "quartierDoc.code", title: "Quartier"},
        {data: "code", title: "Block Code"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ],
    extraFields: ["districtCode","quartierId"]
});