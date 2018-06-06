import {WB_Meters} from '../imports/collection/meter';


import {WB_CustomerType} from "../imports/collection/customerType";
import {WB_Customer} from "../imports/collection/customer";
import {WB_Block} from "../imports/collection/block";
import {WB_Category} from "../imports/collection/category";
import {WB_Class} from "../imports/collection/class";
import {WB_District} from "../imports/collection/district";
import {WB_OperationCode} from "../imports/collection/operationCode";
import {WB_Position} from "../imports/collection/position";
import {WB_Quartier} from "../imports/collection/quartier";
import {WB_Attension} from "../imports/collection/attension";
import {WB_ReferenceType} from "../imports/collection/referenceType";
import {WB_Reference} from "../imports/collection/reference";
import {WB_Tariff} from "../imports/collection/tariff";
import {WB_MetersReading} from "../imports/collection/meterReading";
import {WB_MeterType} from "../imports/collection/meterType";
import {WB_ChangeBlock} from "../imports/collection/changeBlock";
import {WB_Payment} from "../imports/collection/payment.js";
import {unfinishedPayment, unfinishedSaving} from "../imports/collection/unfinshed-work.js";
import {Wb_activity} from "../imports/collection/activity";
import {Transaction, TransactionDetail} from "../imports/collection/transaction";
import {WB_Saving, WB_SavingDetail} from "../imports/collection/saving";
import {WB_Agent} from "../imports/collection/agent";
import {CounterCollection} from "../imports/collection/counter";
import {WB_MeterCode} from "../imports/collection/meterCode";
import {WB_Province} from "../imports/collection/province";
import {WB_Benchmarking} from "../imports/collection/benchmarking";
import {WB_MobileSync} from "../imports/collection/mobileSync";
import {Description} from "../imports/collection/description";
import {WB_RequestUpdateJournalDetail} from "../imports/collection/requestUpdateJournalDetail";
import {WB_RequestCuttingWater} from "../imports/collection/requestCuttingWater";

Security.permit(['insert', 'update', 'remove']).collections([
    Transaction,
    TransactionDetail,
    WB_CustomerType,
    WB_Customer,
    WB_Meters,
    WB_Block,
    WB_Category,
    WB_Class,
    WB_District,
    WB_OperationCode,
    WB_Position,
    WB_Quartier,
    WB_Attension,
    WB_ReferenceType,
    WB_Reference,
    WB_Tariff,
    WB_MetersReading,
    WB_MeterType,
    WB_ChangeBlock,
    WB_Payment,
    unfinishedPayment,
    unfinishedSaving,
    Wb_activity,
    WB_Saving,
    WB_SavingDetail,
    WB_Agent,
    CounterCollection,
    WB_MeterCode,
    WB_Province,
    WB_Benchmarking,
    WB_MobileSync,
    Description,
    WB_RequestUpdateJournalDetail,
    WB_RequestCuttingWater
]).apply();

