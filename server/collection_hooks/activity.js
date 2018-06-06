import 'meteor/matb33:collection-hooks';
import {GeneralFunction} from '../../imports/api/methods/generalFunction.js';

// Collection
import {Wb_activity} from '../../imports/collection/activity';

Wb_activity.before.insert(function (userId, doc) {
    doc._id = GeneralFunction.generatePrefixId(Wb_activity, doc.rolesArea, 3);
});


