import {Pos_Invoice} from "../../../imports/collection/posInvoice";

Meteor.methods({

    queryInvoiceActiveByTableId(tableId) {
        let data = Pos_Invoice.findOne({tableId: tableId, status: {$eq: "Active"}});
        return data;
    }
});
