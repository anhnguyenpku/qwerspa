import {WB_Customer} from '../../collection/customer';
import {TransactionDetail} from '../../collection/transaction';
import {WB_MeterReadingJournalDetail} from '../../collection/meterReadingJournal';
import RequestCuttingWater from '../../api/methods/requestCuttingWater';
import moment from 'moment';

export default class DashboardFn {
    static countCustomer(startOfMonth, endOfMonth, rolesArea) {
        return WB_MeterReadingJournalDetail.find({
            waterConsumption: {$exists: true, $ne: 0},
            rolesArea: rolesArea,
            // prevReadingDate: {$lte: startOfMonth},
            newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}
        }).count();
    }

    static countFullCustomer(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            "contract.contractDate": {$lte: endOfMonth}
        }).count();
    }

    static countInActiveCustomer(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            position: "inactive",
            "contract.contractDate": {$lte: endOfMonth}
        }).count();
    }

    static countCustomerInPeriod(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            "contract.contractDate": {$lte: endOfMonth},
            "contract.contractDate": {$gte: startOfMonth}
        }).count();
    }

    static customerTransaction(dateFrom, dateTo, rolesArea) {
        let startOfMonth = dateFrom || moment().startOf('month').toDate();
        let endOfMonth = dateTo || moment().endOf('month').toDate();
        let meterReadingJournalDetails = WB_MeterReadingJournalDetail.aggregate([
            {
                $match: {
                    waterConsumption: {$exists: true, $ne: 0},
                    rolesArea: rolesArea,
                    prevReadingDate: {$lte: startOfMonth},
                    newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}
                }
            },
            {
                $project: {
                    grandTotal: 1,
                    balance: 1,
                    waterConsumption: 1,
                    paymentStatus: 1,
                    _id: 1
                }
            },
            {
                $group: {
                    _id: null,
                    posted: {
                        $sum: '$grandTotal'
                    },
                    balance: {
                        $sum: '$balance'
                    },

                    totalConsumption: {
                        $sum: '$waterConsumption'
                    },
                    totalInvoiceClosed: {$sum: {$cond: [{$eq: ["$paymentStatus", "closed"]}, 1, 0]}},
                    totalQualityClosed: {$sum: {$cond: [{$eq: ["$paymentStatus", "closed"]}, "$waterConsumption", 0]}},
                }
            },
            {
                $project: {
                    _id: 0,
                    posted: 1,
                    balance: 1,
                    totalConsumption: 1,
                    totalInvoiceClosed: 1,
                    totalQualityClosed: 1,
                    paid: {
                        $subtract: ['$posted', '$balance']
                    }
                }
            }
        ]);
        return meterReadingJournalDetails;
    }

    static totalPostedGraph(rolesArea) {
        let startOfYear = moment().startOf('year').toDate();
        let endOfYear = moment().endOf('year').toDate();
        let meterReadingJournalDetails = WB_MeterReadingJournalDetail.aggregate([
            {
                $match: {
                    waterConsumption: {$exists: true, $ne: 0},
                    rolesArea: rolesArea,
                }
            },
            {
                $group: {
                    _id: {month: {$month: '$newReadingDate',}, year: {$year: '$newReadingDate'}},
                    amount: {
                        $sum: '$grandTotal'
                    }
                }
            },
            {
                $sort: {'_id.month': 1}
            },
            {
                $group: {
                    _id: null,
                    amountArr: {
                        $push: {
                            month: '$_id.month',
                            amount: '$amount'

                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    amountArr: 1
                }
            }
        ]);
        return meterReadingJournalDetails[0];
    }

    static totalOverdue(rolesArea, pipeline) {
        return RequestCuttingWater.totalOverdue(rolesArea, pipeline);
    }


    //Sum Dashboard

    static countCustomerSum(startOfMonth, endOfMonth, rolesArea) {
        return WB_MeterReadingJournalDetail.find({
            waterConsumption: {$exists: true, $ne: 0},
            rolesArea: rolesArea,
            sumBarcode: {$exists: true},
            // prevReadingDate: {$lte: startOfMonth},
            newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}
        }).count();
    }

    static countFullCustomerSum(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            sumId: {$exists: true},
            "contract.contractDate": {$lte: endOfMonth}
        }).count();
    }

    static countInActiveCustomerSum(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            sumId: {$exists: true},
            position: "inactive",
            "contract.contractDate": {$lte: endOfMonth}
        }).count();
    }

    static countCustomerInPeriodSum(startOfMonth, endOfMonth, rolesArea) {
        return WB_Customer.find({
            rolesArea: rolesArea,
            sumId: {$exists: true},
            "contract.contractDate": {$lte: endOfMonth},
            "contract.contractDate": {$gte: startOfMonth}
        }).count();
    }

    static customerTransactionSum(dateFrom, dateTo, rolesArea) {
        let startOfMonth = dateFrom || moment().startOf('month').toDate();
        let endOfMonth = dateTo || moment().endOf('month').toDate();
        let meterReadingJournalDetails = WB_MeterReadingJournalDetail.aggregate([
            {
                $match: {
                    waterConsumption: {$exists: true, $ne: 0},
                    rolesArea: rolesArea,
                    sumBarcode: {$exists: true},
                    prevReadingDate: {$lte: startOfMonth},
                    newReadingDate: {$gte: startOfMonth, $lte: endOfMonth}
                }
            },
            {
                $project: {
                    grandTotal: 1,
                    balance: 1,
                    waterConsumption: 1,
                    paymentStatus: 1,
                    _id: 1
                }
            },
            {
                $group: {
                    _id: null,
                    posted: {
                        $sum: '$grandTotal'
                    },
                    balance: {
                        $sum: '$balance'
                    },

                    totalConsumption: {
                        $sum: '$waterConsumption'
                    },
                    totalInvoiceClosed: {$sum: {$cond: [{$eq: ["$paymentStatus", "closed"]}, 1, 0]}},
                    totalQualityClosed: {$sum: {$cond: [{$eq: ["$paymentStatus", "closed"]}, "$waterConsumption", 0]}},
                }
            },
            {
                $project: {
                    _id: 0,
                    posted: 1,
                    balance: 1,
                    totalConsumption: 1,
                    totalInvoiceClosed: 1,
                    totalQualityClosed: 1,
                    paid: {
                        $subtract: ['$posted', '$balance']
                    }
                }
            }
        ]);
        return meterReadingJournalDetails;
    }


}