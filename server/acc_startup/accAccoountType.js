import {RefModify} from '../../imports/collection/refModify.js';

import {Acc_AccountType} from '../../imports/collection/accAccountType';

Meteor.startup(function () {
    if (Acc_AccountType.find().count() == 0) {
        let accountTypeList = [
            {
                _id: '10',
                name: 'Bank'
            },
            {
                _id: '11',
                name: 'Accounts Receivable (A/R)'
            },
            {
                _id: '15',
                name: 'Other Current Assets'
            },

            {
                _id: '20',
                name: 'Fixed Assets'
            },
            {
                _id: '29',
                name: 'Other Asset'
            },
            {
                _id: '30',
                name: 'Accounts Payable (A/P)'
            },
            {
                _id: '32',
                name: 'Credit Card'
            },
            {
                _id: '34',
                name: 'Current Liability'
            },
            {
                _id: '36',
                name: 'Long Term Liability'
            },
            {
                _id: '40',
                name: 'Equity'
            }, {
                _id: '41',
                name: 'Retain Earning'
            },
            {
                _id: '50',
                name: 'Income'
            },
            {
                _id: '51',
                name: 'Other Income'
            },
            {
                _id: '60',
                name: 'Expense'
            },
            {
                _id: '61',
                name: 'Other Expense'
            },
            {
                _id: '70',
                name: 'Cost Of Good Sold'
            }
        ];
        accountTypeList.forEach(function (obj) {
            Acc_AccountType.insert(obj);
        })
    }

});