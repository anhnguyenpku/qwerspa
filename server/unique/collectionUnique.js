import {Acc_ClosingEntry} from '../../imports/collection/accClosingEntry';
import {Acc_ChartAccountBalance} from '../../imports/collection/accChartAccountBalance';

Acc_ClosingEntry._ensureIndex({month: 1, year: 1, rolesArea: 1}, {unique: 1});
Acc_ChartAccountBalance._ensureIndex({month: 1, year: 1, rolesArea: 1, chartAccountId: 1, currencyId: 1}, {unique: 1});