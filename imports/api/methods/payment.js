import {WB_Block} from "../../collection/block";
import {Wb_meterReadingJournal, WB_MeterReadingJournalDetail} from "../../collection/meterReadingJournal";
import {unfinishedPayment} from "../../collection/unfinshed-work";
import {WB_Payment} from "../../collection/payment";
import {TransactionDetail} from "../../collection/transaction";
import Aggr from "./aggregation";
import {WB_waterBillingSetup} from '../../collection/waterBillingSetup';
import {WB_RequestCuttingWater} from '../../collection/requestCuttingWater';

class PaymentModel {
    unpaidCustomer(user, blockId, querySelector, page, q) {
        if (user) {
            let selector = !querySelector ? {
                isCutOff: true,
                status: 'active',
                closedAt: {$exists: false}
            } : querySelector;
            selector.blockId = {$in: [blockId]}
            let searchQ = {'customerDoc.name': {$nin: ['']}};
            let limit = page * 20;
            if (!!q) {
                let reg = new RegExp(q, 'mi');
                searchQ = {
                    '$or': [
                        {streetNo: reg},
                        {'customerDoc.khName': reg},
                    ]
                }
            }
            return WB_RequestCuttingWater.aggregate([
                {$match: selector},
                {$sort: {streetNo: 1}},
                {
                    $lookup: {
                        from: 'wb_customer',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerDoc'
                    }
                },
                {
                    $unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}
                },
                {
                    $match: searchQ
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'wb_meterReadingJournalDetails',
                        localField: 'journalBookDetailId',
                        foreignField: '_id',
                        as: 'journalBookDetailDoc'
                    }
                },
                {
                    $unwind: {path: '$journalBookDetailDoc', preserveNullAndEmptyArrays: true},
                },
                {
                    $project: {
                        journalBookDetailId: 1,
                        invoiceExpiredAfter: 1,
                        barcode: '$journalBookDetailDoc.barcode',
                        waterConsumption: '$journalBookDetailDoc.waterConsumption',
                        grandTotal: '$journalBookDetailDoc.grandTotal',
                        streetNo: 1,
                        dpc: 1,
                        address: '$customerDoc.address',
                        customerId: 1,
                        customerName: '$customerDoc.khName',
                        blockId: 1,
                        isCutOff: 1,
                        status: 1,
                        dateString: {$dateToString: {format: "%m", date: "$newReadingDate"}},
                        rolesArea: 1,
                        newReadingDate: 1,
                        requestedOpen: 1,
                        openedAt: 1,
                        closedAt: 1,
                        paidAt: 1,
                        desc: 1,
                        createdAt: 1
                    }
                },
                {$sort: {newReadingDate: 1}},
                {
                    $group: {
                        _id: '$streetNo',
                        address: {$last: '$address'},
                        customerId: {$last: '$customerId'},
                        streetNo: {$last: '$streetNo'},
                        dpc: {$last: '$dpc'},
                        paidAt: {$last: '$paidAt'},
                        openedAt: {$last: '$openedAt'},
                        isCutOff: {$last: '$isCutOff'},
                        journalBookDetailIds: {
                            $push: '$journalBookDetailId'

                        },
                        requestedOpen: {$last: '$requestedOpen'},
                        customerName: {$last: '$customerName'},
                        data: {
                            $addToSet: '$$ROOT'
                        },
                    }
                },
                {
                    $sort: {_id: 1}
                },

            ])

        } else {
            throw new Meteor.Error("You must be login to do operation.");

        }

    }

    toggleSwitchOffWater(customerId, journalBookDetailId, toggleIsCutOff, desc, userId) {
        let balance = 0;
        WB_MeterReadingJournalDetail.find({_id: {$in: journalBookDetailId}}).fetch()
            .map(journalBook => {
                balance += journalBook.balance
            });
        if (balance > 0) {
            if (toggleIsCutOff) {
                return WB_RequestCuttingWater.update({customerId: customerId}, {
                    $set: {
                        isCutOff: false,
                        desc: desc,
                        closedAt: moment().toDate(),
                        toggleOffBy: userId
                    }
                }, {multi: true});
            } else {
                return WB_RequestCuttingWater.update({customerId: customerId}, {
                    $set: {isCutOff: true, toggleOffBy: userId},
                    $unset: {closedAt: '', desc: ''}
                }, {multi: true});
            }
        } else {
            throw new Meteor.Error('ប្រតិបតិ្តការមិនបានជោគជ័យ.វិក័យបានទូរទាត់រួចរាល់')
        }
    }

    toggleSwitchOnWater(customerId, journalBookDetailId, toggleIsCutOff, userId) {
        let selector = {};
        if (toggleIsCutOff) {
            selector.$set = {
                toggleOnBy: userId,
                openedAt: moment().toDate(),
                requestedOpen: !toggleIsCutOff
            };
        } else {
            selector = {
                $set: {
                    toggleOnBy: userId,
                    requestedOpen: !toggleIsCutOff
                },
                $unset: {
                    openedAt: ''
                }
            }
        }
        return WB_RequestCuttingWater.update({customerId: customerId}, selector, {multi: true});
    }

    waterBillingSetup(user) {
        if (user) {
            return WB_waterBillingSetup.findOne({rolesArea: {$in: user.rolesArea}});
        }
    }

    overdueCustomer() {
        let meterJournalArr = [];
        WB_waterBillingSetup.find({}).forEach(function (wbSetup) {
            let selector = {
                waterConsumption: {$gt: 0},
                closedAt: {$exists: false},
                balance: {$gt: 0},
                requestCuttingWaterId: {$exists: false}
            };
            let meterJournal = WB_MeterReadingJournalDetail.find(
                selector, {
                    grandTotal: 1,
                    block: 1,
                    _id: 1,
                    newReadingDate: 1,
                    meterReadingJournalId: 1,
                    rolesArea: 1,
                    customerId: 1,
                    streetNo: 1,
                    dpc: 1
                }
            ).fetch();
            meterJournalArr.push({invoiceExpiredAfter: wbSetup.invoiceExpiredAfter, data: [...meterJournal]});
        });
        return meterJournalArr;
    }
}

export default new PaymentModel();