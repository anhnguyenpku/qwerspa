
//Collection
import {WB_Benchmarking} from '../../imports/collection/benchmarking'

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const BenchmarkingTabular = new Tabular.Table({
    name: "wb.benchmarkingTabular",
    collection: WB_Benchmarking,
    columnDefs: [
        {"width": "10px", "targets": 4}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "name", title: "សូចនាករ"},
        {data: "des", title: "សេចក្តីពន្យល់"},
        {data: "unit", title: "ឯកតា"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});