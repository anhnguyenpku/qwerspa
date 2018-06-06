//Collection
import {WB_Tariff} from '../../imports/collection/tariff'
import numeral from 'numeral';
Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const TariffTabular = new Tabular.Table({
    name: "wb.tariffTabular",
    collection: WB_Tariff,
    columnDefs: [
        // {"width": "10px", "targets": 6}
    ],
    columns: [
        {data: "_id", title: "No"},
        {data: "name", title: "Name"},
        {
            data: "categoryId",
            title: "Category",
        },
        {data: "code", title: "Code"},
        {data: "typeId", title: "Type"},
        {data: "measureId", title: "UOM"},
        {data: "floorBy", title: "Floor By"},
        {data: "isFixedFloor", title: "Fixed Floor"},
        {
            data: "maintenance",
            title: "Main.. Price",
        },
        {
            data: "contributionFeePrice",
            title: "Contrib.. Price"
        },
        {
            data: "status",
            title: "Status",
            render: function (val) {
                if (val == 'enable') {
                    return '<span class="badge teal white-text">Enable</span>'
                }
                return '<span class="badge yellow darken-4 white-text">Disable</span>'
            }
        },
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ],
    extraFields: ['startRange', 'endRange','isFixedMaintenance','rangePrice','penaltyAmount','feeAmount']
});