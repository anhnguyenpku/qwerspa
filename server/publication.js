import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {WB_CustomerType} from "../imports/collection/customerType";
import {WB_Customer} from "../imports/collection/customer";
import {WB_Block} from "../imports/collection/block";
import {WB_Category} from "../imports/collection/category";
import {WB_Class} from "../imports/collection/class";
import {WB_District} from "../imports/collection/district";
import {WB_OperationCode} from "../imports/collection/operationCode";
import {WB_Position} from "../imports/collection/position";
import {WB_Quartier} from "../imports/collection/quartier";
import {WB_Attension} from "../imports/collection/attension";
import {WB_ReferenceType} from "../imports/collection/referenceType";
import {WB_Reference} from "../imports/collection/reference";
import {WB_Tariff} from "../imports/collection/tariff";
import {Wb_activity} from "../imports/collection/activity";
import {WB_MetersReading} from "../imports/collection/meterReading";
import {Wb_meterReadingJournal} from "../imports/collection/meterReadingJournal"
import {WB_MeterType} from "../imports/collection/meterType"
import {WB_MeterCode} from "../imports/collection/meterCode"
import {WB_ChangeBlock} from "../imports/collection/changeBlock"
import {WB_waterBillingSetup} from "../imports/collection/waterBillingSetup"
import {WB_MobileSync} from "../imports/collection/mobileSync"
import {WB_RequestUpdateJournalDetail} from "../imports/collection/requestUpdateJournalDetail"
import {WB_RequestCuttingWater} from "../imports/collection/requestCuttingWater"
import {Acc_Exchange} from "../imports/collection/accExchange"
import {Pos_Invoice} from "../imports/collection/posInvoice"
import {Pos_AverageInventory} from "../imports/collection/posAverageInventory"
import {Pos_Location} from "../imports/collection/posLocation"
import {Pos_Product} from "../imports/collection/posProduct"
import MobileApi from "../imports/api/methods/mobile";
import {LoginSetup} from "../imports/collection/loginSetup";
//Water Billing setup
Meteor.publish('wb_waterBillingSetup', function (rolesArea) {
    if (this.userId) {
        return WB_waterBillingSetup.find({rolesArea});
    }
    return this.ready();

});

//Login Setup
Meteor.publish('loginSetup', function () {
    return LoginSetup.find({});

});
//Exchange
Meteor.publish('Acc_ExchangeActive', function (rolesArea) {
    if (this.userId) {
        return Acc_Exchange.find({rolesArea, status: true});
    }
    return this.ready();

});
//Tariff
Meteor.publish('wb_tariffPub', function () {
    if (this.userId) {
        return WB_Tariff.find({});
    }
    return this.ready();
});
//Customer Type
Meteor.publish('wb_customerTypeById', function wb_customerTypeById({_id}) {
    if (this.userId) {
        let doc = WB_CustomerType.find({_id});
        return doc;
    }
    return this.ready();
});

//Customer
Meteor.publish('wb_customerById', function wb_customerById({_id}) {
    if (this.userId) {
        Meteor._sleepForMs(200);
        let doc = WB_Customer.find({_id});
        return doc;
    }
    return this.ready();
});

//Block
Meteor.publish('wb_blockById', function wb_blockById({_id}) {
    if (this.userId) {
        let doc = WB_Block.find({_id});
        return doc;
    }
    return this.ready();
});
//Category
Meteor.publish('wb_categoryById', function wb_categoryById({_id}) {
    if (this.userId) {
        let doc = WB_Category.find({_id});
        return doc;
    }
    return this.ready();
});
//publish categories which limit to 50
Meteor.publish('pub_categories', function () {
    if (this.userId) {
        return WB_Category.find({}, {limit: 50});
    }
    return this.ready();
    import {publishComposite} from 'meteor/reywood:publish-composite';

});

//Class
Meteor.publish('wb_classById', function wb_classById({_id}) {
    if (this.userId) {
        let doc = WB_Class.find({_id});
        return doc;
    }
    return this.ready();
});
//District
Meteor.publish('wb_districtById', function wb_districtById({_id}) {
    if (this.userId) {
        let doc = WB_District.find({_id});
        return doc;
    }
    return this.ready();
});
//Operation Code
Meteor.publish('wb_operationCodeById', function wb_operationCodeById({_id}) {
    if (this.userId) {
        let doc = WB_OperationCode.find({_id});
        return doc;
    }
    return this.ready();
});
//Position
Meteor.publish('wb_positionById', function wb_positionById({_id}) {
    if (this.userId) {
        let doc = WB_Position.find({_id});
        return doc;
    }
    return this.ready();
});
//Quartier
Meteor.publish('wb_quartierById', function wb_quartierById({_id}) {
    if (this.userId) {
        Meteor._sleepForMs(200);
        let doc = WB_Quartier.find({_id});
        return doc;
    }
    return this.ready();
});
//attension
Meteor.publish('wb_attensionById', function wb_attensionById({_id}) {
    if (this.userId) {
        let doc = WB_Attension.find({_id});
        return doc;
    }
    return this.ready();
});
//referenceType
Meteor.publish('wb_referenceTypeById', function wb_referenceTypeById({_id}) {
    if (this.userId) {
        let doc = WB_ReferenceType.find({_id});
        return doc;
    }
    return this.ready();
});

//reference
Meteor.publish('wb_referenceById', function wb_referenceById({_id}) {
    if (this.userId) {
        let doc = WB_Reference.find({_id});
        return doc;
    }
    return this.ready();
});
//tariff
Meteor.publish('wb_tariffById', function wb_tariffById({_id}) {
    if (this.userId) {
        let doc = WB_Tariff.find({_id});
        return doc;
    }
    return this.ready();
});

//activity
Meteor.publish('wb_activity', function wb_tariff(selector) {
    if (this.userId) {
        let doc = Wb_activity.find(selector, {limit: 50});
        return doc;
    }
    return this.ready();
});
//meteor reading
Meteor.publish('wb_meterReadingById', function wb_meterReadingById(_id) {
    if (this.userId) {
        let doc = WB_MetersReading.find(_id);
        return doc;
    }
    return this.ready();
});

//setting price

Meteor.publish('wb_reference', function wb_meteorReadingById(selector) {
    if (this.userId) {
        if (selector) {
            return WB_Reference.find(selector, {limit: 50});
        }
        return this.ready();
    }
    return this.ready();
});

//activity

Meteor.publish('wb_meterTypePub', function () {
    if (this.userId) {
        return WB_MeterType.find({});
    }
});

Meteor.publish('wb_meterCodePub', function () {
    if (this.userId) {
        return WB_MeterCode.find({});
    }
});

Meteor.publish('wb_changeBlock', function wb_changeBlock(selector) {
    if (this.userId) {
        if (selector) {
            return WB_ChangeBlock.find(selector);
        }
        return this.ready();
    }
    return this.ready();
});

Meteor.publish('wb_userId', function wb_userId() {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {
            fields: {
                username: 1,
                email: 1,
                _id: 1,
                fullName: 1,
                areaId: 1,
                roles: 1,
                services: 1,
                profile: 1,
                createdAt: 1
            }
        });
    }
    return this.ready();
});

//mobile sync notification

// Server

publishComposite('mobileSynced_notify', function () {
    return {
        find() {
            if (this.userId) {
                let currentUser = this.userId;
                // Find top ten highest scoring posts
                let startOfDay = moment().subtract(1, 'days').startOf('days').format("YYYY-MM-DD HH:mm");
                let endOfDay = moment().endOf('days').format("YYYY-MM-DD HH:mm");
                let meterReading = WB_MetersReading.find({assignUser: {$in: [currentUser]}}).fetch();
                let meterReadingIds = meterReading.map(o => o._id);
                return WB_MobileSync.find({
                    meterReadingId: {$in: meterReadingIds},
                    dateStr: {$gte: startOfDay, $lte: endOfDay}
                }, {sort: {createdAt: -1}});
            }
        },
        children: [
            {
                find(mobileSync) {
                    return Meteor.users.find({_id: mobileSync.userId});
                }
            },
            {
                find(mobileSync) {
                    return Wb_meterReadingJournal.find({_id: mobileSync.journalBookId});
                }
            }

        ]
    }
});

//request update journal detail
publishComposite('requestUpdateJournalDetail', function () {
    return {
        find() {
            if (this.userId) {
                let currentUser = this.userId;
                // Find top ten highest scoring posts
                let meterReading = WB_MetersReading.find({assignUser: {$in: [currentUser]}}).fetch();
                let meterReadingIds = meterReading.map(o => o._id);
                return WB_RequestUpdateJournalDetail.find({
                    meterReadingId: {$in: meterReadingIds},
                    status: 'pending'
                }, {limit: 50});
            }
        },
        children: [
            {
                find(request) {
                    return Meteor.users.find({_id: request.requestBy});
                }
            },
        ]
    }
});

//requesting switch on water
Meteor.publish("creditor_switchOnWater", function (userId) {
    let user = Meteor.users.findOne({_id: userId || this.userId});
    if (user) {
        let meterReading = WB_MetersReading.find({assignUser: {$in: [user._id]}}).fetch();
        let blockIds = meterReading.map(o => o.blockId);

        return WB_RequestCuttingWater.find({requestedOpen: true, blockId: {$in: blockIds}}, {limit: 100});
    }
    return this.ready();
});

//POS Invoice Expired
Meteor.publish("pos_invoiceExpired", function (userId, rolesArea) {
    let user = Meteor.users.findOne({_id: userId || this.userId});
    if (user) {
        return Pos_Invoice.find({
            status: {$ne: "Complete"},
            dueDate: {
                $lte: moment().endOf("days").toDate()
            },
            rolesArea: rolesArea
        }, {_id: 1})
    }
    return this.ready();
});

//POS Inventory Non Stock
Meteor.publish("pos_inventoryNonStock", function (userId, rolesArea, tranNumber) {
    let user = Meteor.users.findOne({_id: userId || this.userId});
    let mainLocation = Pos_Location.findOne({rolesArea: rolesArea, isMainLocation: true});
    let self = this;
    if (user) {
        if (mainLocation) {
            let inv = Pos_AverageInventory.aggregate([
                    {
                        $match: {
                            averageInventoryDate: {$lte: moment().endOf("days").toDate()},
                            rolesArea: rolesArea,
                            locationId: mainLocation._id
                        }
                    },
                    {
                        $sort: {
                            createdAt: 1
                        }
                    },
                    {
                        $group: {
                            _id: {
                                itemId: "$itemId",
                                locationId: "$locationId",
                            },
                            qtyEnding: {$last: "$qtyEnding"},
                            id: {$last: "$_id"}
                        }
                    },
                    {
                        $lookup: {
                            from: "pos_product",
                            localField: "_id.itemId",
                            foreignField: "_id",
                            as: "productDoc"
                        }
                    },
                    {$unwind: {path: '$productDoc', preserveNullAndEmptyArrays: true}}
                    ,

                    {
                        $project: {
                            itemId: "$_id.itemId",
                            locationId: "$_id.locationId",
                            minimumStock: "$productDoc.minimumStock",
                            qtyEnding: "$qtyEnding",
                            isMinimumStock: {$cond: [{$gt: ["$qtyEnding", "$productDoc.minimumStock"]}, true, false]},
                            id: "$id"

                        }
                    },
                    {
                        $match: {isMinimumStock: false}
                    },
                    {
                        $group: {
                            _id: null,
                            idList: {$push: "$id"}
                        }
                    }

                ]
            );

            self.added('counts', mainLocation._id, {
                count: (inv[0] && inv[0].idList && inv[0].idList.length) || 0
            });
            // return Pos_AverageInventory.find({_id: {$in: inv[0].idList || []}});
        }

    }

    return this.ready();
});
