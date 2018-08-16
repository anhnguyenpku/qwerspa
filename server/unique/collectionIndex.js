import {Pos_Product} from '../../imports/collection/posProduct';

Pos_Product._ensureIndex({name: 1,}, {unique: false});
Pos_Product._ensureIndex({createdAt: 1}, {unique: false});
Pos_Product._ensureIndex({rolesArea: 1}, {unique: false});
Pos_Product._ensureIndex({code: 1}, {unique: false});
