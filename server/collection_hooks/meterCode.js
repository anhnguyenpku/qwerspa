import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_MeterCode} from '../../imports/collection/meterCode';

WB_MeterCode.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generateId(WB_MeterCode, 3);
});


