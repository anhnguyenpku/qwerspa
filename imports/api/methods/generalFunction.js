import {Acc_Exchange} from '../../collection/accExchange';

import {roundCurrency} from "./roundCurrency"

export class GeneralFunction {
    static generateId(collection, length, field) {
        field = field ? field : '_id';
        let newId = pad(1, length);
        let sortBy = {};
        sortBy[field] = -1;
        let obj = collection.findOne({}, {sort: sortBy});
        if (obj != null) {
            let tmpId = parseInt(obj[field]) + 1;
            // Check length
            if (tmpId.toString().length > length) {
                throw new Meteor.Error('Invalid Id length');
            } else {
                newId = pad(tmpId, length);
            }
        }
        return newId;
    }

    static generatePrefixId(collection, prefix, length, field) {
        field = field ? field : '_id';
        let newId = prefix + pad(1, length);
        let reg = {};
        reg[field] = new RegExp("^" + prefix, "m");
        let sortBy = {};
        sortBy[field] = -1;

        let obj = collection.findOne(reg, {sort: sortBy});

        if (obj != null) {
            let currentId = (obj[field]).substr((obj[field]).length - length);
            let tmpId = parseInt(currentId) + 1;
            // Check length
            if (tmpId.toString().length > length) {
                throw new Meteor.Error('Invalid Id length');
            } else {
                tmpId = pad(tmpId, length);
                newId = prefix + tmpId;
            }
        }

        return newId;
    }

    //to use this you must have coutner collection with type and rolesArea
    // export const CounterCollecion = new SimpleSchema({
    //     type: {
    //         type: String, //customer , receivePayment,
    //     },
    //     sequence: {
    //         type: Number,
    //     },
    //     rolesArea: {
    //         type: String
    //     }
    // });
    static generatePrefixIdWithCounter(seqType, rolesArea, prefix, length) {
        let obj = CounterCollection.findOne({type: seqType, rolesArea: rolesArea});
        let tempId = pad(1, length);
        if (!!obj) {
            tempId = pad(obj.sequence + 1, length);
            CounterCollection.update({type: seqType, rolesArea: rolesArea}, {$inc: {sequence: 1}});
        } else {
            CounterCollection.insert({type: seqType, rolesArea: rolesArea, sequence: 1});
        }
        let prefixStr = prefix ? prefix + '' + tempId : tempId;
        return prefixStr;
    }

    static roundKhmerCurrency(value) {
        value = parseInt(value);
        let returnValue = 0;
        if (value > 0) {
            returnValue = value % 100 >= 50 ? value + (100 - (value % 100)) : value - (value % 100);
        } else if (value < 0) {
            let absRK = Math.abs(value);
            returnValue = absRK % 100 > 50 ? value - (100 - (absRK % 100)) : value + (absRK % 100);
        }
        return returnValue;
    }

    static exchange(curFrom, curTo, val, rolesArea) {
        if (val == 0) {
            return val;
        } else {
            let exchangeDoc = Acc_Exchange.findOne({status: true, rolesArea: rolesArea});
            let result = 0;
            if (exchangeDoc) {
                if (curFrom == "USD") {
                    if (curTo == "KHR") {
                        result = roundCurrency(val * exchangeDoc.rates.KHR, "KHR");
                    } else if (curTo == "THB") {
                        result = roundCurrency(val * exchangeDoc.rates.THB, "THB");
                    } else {
                        result = val;
                    }

                } else if (curFrom == "KHR") {
                    if (curTo == "USD") {
                        result = roundCurrency(val / exchangeDoc.rates.KHR, "USD");
                    } else if (curTo == "THB") {
                        result = roundCurrency(val * exchangeDoc.rates.THB / exchangeDoc.rates.KHR,
                            "THB"
                        );
                    } else {
                        result = val;
                    }
                } else if (curFrom == "THB") {
                    if (curTo == "USD") {
                        result = roundCurrency(val / exchangeDoc.rates.THB, "USD");
                    } else if (curTo == "KHR") {
                        result = roundCurrency(val * exchangeDoc.rates.KHR / exchangeDoc.rates.THB, "KHR"
                        );
                    } else {
                        result = val;
                    }
                }
            }
            return result;
        }
    }
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}