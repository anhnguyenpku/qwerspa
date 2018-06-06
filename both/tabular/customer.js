// //Collection
// import {WB_Customer} from '../../imports/collection/customer';
// import {VW_Customer} from '../../imports/collection/customer';

// Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

// export const CustomerTabular = new Tabular.Table({
//     name: "wb.customerTabular",
//     collection: VW_Customer,
//     // columnDefs: [
//     //     {"width": "50px", "targets": 13}
//     // ],
//     columns: [
//         {data: "dpc", title: "DPC"},
//         {data: "name", title: "En Name"},
//         {data: "khName", title: "KH Name"},
//         {data: "categoryDoc.name", title: "Category"},
//         {data: "classDoc.name", title: "Class"},
//         // {data: "operationCode", title: "Operation Code"},
//         {data: "streetNo", title: "Street No"},
//         {data: "address", title: "Address"},
//         {data: "phoneNumber", title: "Tel"},
//         {data: "contact", title: "Contact"},
//         {
//             tmpl: Meteor.isClient && Template.wb_actionFromSemantic
//         }
//     ]
// });