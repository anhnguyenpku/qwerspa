import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_Tariff} from '../../imports/collection/tariff.js';

WB_Tariff.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generatePrefixId(WB_Tariff, doc.rolesArea, 3);
});


