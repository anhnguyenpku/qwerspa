import numeral from 'numeral';
//Collection
import {WB_Payment} from '../../imports/collection/payment.js';

Meteor.isClient && require('../../imports/ui/actionButtons/actionButton.html');

export const PaymentTabular = new Tabular.Table({
    name: "wb.paymentTabular",
    collection: WB_Payment,
    columnDefs: [
        {"width": "10px", "targets": 6}
    ],
    order: [[1, "desc"]],
    columns: [
        {data: "seqId", title: "#"},
        {data: "dateFormatted", title: "Date"},
        {
            data: "dueAmount",
            title: "Due Amount",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        },
        {
            data: "paidAmount",
            title: "Paid Amount",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        },
        {
            data: "withdrawSaving",
            title: "Withdraw",
            render: function (val) {
                return numeral(val).format('0,0.00');
            }
        },
        {
            data: "balance",
            title: "Balance",
            render: function (val, type, doc) {
                return numeral(doc.dueAmount - (doc.paidAmount + doc.withdrawSaving)).format('0,0.00');
            }
        },
        {
            data: "status",
            title: "Status",
            render: function (val) {
                let status = {
                    closed: val == 'closed',
                }
                if (status.closed) {
                    return `<span class="badge btn-success">Closed</span></h1>`
                } else {
                    return `<span class="badge btn-warning">Partial</span></h1>`
                }
            }
        },
        {
            data: "createdAt", title: "Created At",
            render: (val) => {
                return moment(val).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ]
});