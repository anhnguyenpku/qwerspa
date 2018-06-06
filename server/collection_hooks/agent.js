import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {WB_Agent} from '../../imports/collection/agent';

WB_Agent.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generatePrefixId(WB_Agent, doc.rolesArea, 5);
});


