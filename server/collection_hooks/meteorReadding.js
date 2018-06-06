import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_MetersReading} from '../../imports/collection/meterReading';

WB_MetersReading.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generateId(WB_MetersReading, 4);
});


