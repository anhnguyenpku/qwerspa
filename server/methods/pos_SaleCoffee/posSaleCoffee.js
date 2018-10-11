import {Pos_Invoice} from "../../../imports/collection/posInvoice";

Meteor.methods({

    queryInvoiceActiveByLocationId(locationId) {
        let data = Pos_Invoice.findOne({locationId: locationId, status: {$eq: "Active"}});
        return data;
    }
});
