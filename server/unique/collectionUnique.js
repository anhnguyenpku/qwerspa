import {Acc_ClosingEntry} from '../../imports/collection/accClosingEntry';
import {Acc_ChartAccountBalance} from '../../imports/collection/accChartAccountBalance';
import {Acc_ChartAccount} from '../../imports/collection/accChartAccount';
import {Pos_Invoice} from '../../imports/collection/posInvoice';
import {Pos_Vendor} from '../../imports/collection/posVendor';
import {Pos_Customer} from '../../imports/collection/posCustomer';
import {Pos_Term} from '../../imports/collection/posTerm';
import {Pos_Bill} from '../../imports/collection/posBill';
import {Pos_ConvertInventory} from '../../imports/collection/posConvertInventory';
import {Pos_ReceivePayment} from '../../imports/collection/posReceivePayment';
import {Pos_SaleOrder} from '../../imports/collection/posSaleOrder';
import {Pos_TransferInventory} from '../../imports/collection/posTransferInventory';
import {Pos_Unit} from '../../imports/collection/posUnit';
import {Pos_Location} from '../../imports/collection/posLocation';
import {Pos_Category} from '../../imports/collection/posCategory';
import {Pos_PayBill} from '../../imports/collection/posPayBill';
import {Pos_Product} from '../../imports/collection/posProduct';


Acc_ClosingEntry._ensureIndex({month: 1, year: 1, rolesArea: 1}, {unique: 1});
Acc_ChartAccount._ensureIndex({code: 1, rolesArea: 1}, {unique: 1});
Acc_ChartAccountBalance._ensureIndex({month: 1, year: 1, rolesArea: 1, chartAccountId: 1, currencyId: 1}, {unique: 1});
Pos_Vendor._ensureIndex({name: 1, rolesArea: 1, createdUser: 1, phoneNumber: 1}, {unique: 1});
Pos_Customer._ensureIndex({name: 1, rolesArea: 1, createdUser: 1, phoneNumber: 1}, {unique: 1});
Pos_Term._ensureIndex({name: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_Bill._ensureIndex({payBillDateName: 1, vendorId: 1, billNo: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_Invoice._ensureIndex({invoiceDateName: 1, customerId: 1, invoiceNo: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_PayBill._ensureIndex({
    payBillDate: 1,
    totalPaid: 1,
    locationId: 1,
    vendorId: 1,
    rolesArea: 1,
    createdUser: 1
}, {unique: 1});
Pos_Unit._ensureIndex({name: 1, code: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_Location._ensureIndex({name: 1, code: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_Category._ensureIndex({name: 1, code: 1, subCategoryOf: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_Product._ensureIndex({name: 1, code: 1, categoryId: 1, rolesArea: 1, createdUser: 1}, {unique: 1});
Pos_ConvertInventory._ensureIndex({
    date: 1,
    productId: 1,
    locationId: 1,
    qty: 1,
    rolesArea: 1,
    createdUser: 1
}, {unique: 1});

Pos_ReceivePayment._ensureIndex({
    receivePaymentDate: 1,
    totalPaid: 1,
    customerId: 1,
    locationId: 1,
    rolesArea: 1,
    createdUser: 1
}, {unique: 1});
Pos_SaleOrder._ensureIndex({
    saleOrderDate: 1,
    customerId: 1,
    locationId: 1,
    rolesArea: 1,
    createdUser: 1
}, {unique: 1});
Pos_TransferInventory._ensureIndex({
    transferInventoryDate: 1,
    locationFromId: 1,
    locationToId: 1,
    total: 1,
    rolesArea: 1,
    createdUser: 1
}, {unique: 1});

