<!--
<template>
    <div class="print-posted-meter-reading">
        <div class="no-print">
            <div slot="header" class="no-print">
                <el-row type="flex" style="float: right">
                    <el-col :span="26">
                        <button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">
                            Customize
                        </button>
                        <button type="button" class="btn btn-success " v-on:click="printInvoice"
                                data-target="#postPrintInvoice">
                            Print
                        </button>
                        &lt;!&ndash;<button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">&ndash;&gt;
                        &lt;!&ndash;Customize&ndash;&gt;
                        &lt;!&ndash;</button>&ndash;&gt;
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="A4">
            &lt;!&ndash;<div class="sheet padding-3mm">&ndash;&gt;
            <div class="no-print">
                <div class="picture"></div>
                <div v-show="postedInvoiceIsZero()">
                    <br>
                    <p style="text-align: center">No Data</p>
                </div>
            </div>
            <div v-for="doc in reportData">
                <div class="sheet "
                     style="padding-left: 10px;padding-right: 10px; ;margin-top: 2.8cm;page-break-after:always; overflow:none;">
                    <table width="100%">
                        <tbody>
                        <tr style="border: 0px;">
                            <th colspan="3"
                                style="font-family: Khmer OS Muol Light; vertical-align: middle ;font-size: 11px;padding-top: 5px; !important">
                                <span class="no-print">ឈ្មេាះ <br>Name</span>
                            </th>
                            <th colspan="10"
                                style="font-family: Khmer OS Battambang; vertical-align: middle;font-size: 13px;padding-top: 5px;padding-left: 15px  !important;">
                                <b>{{doc.customerDoc.khName}}</b>
                            </th>
                            <th colspan="5" class="postInvoiceTh" style="padding-right: 35px;"><span
                                    class="no-print">លេខអតិថិជន<br>Customer No</span></th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 5px; padding-bottom: 10px;font-size: 13px;padding-left: 10px;">{{doc.customerDoc._id}}
                            </th>

                            <th colspan="5" class="postInvoiceTh"><span class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ<br>Billing Date</span>
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top:5px; padding-bottom: 10px;padding-left: 5px;font-size: 13px;">
                                {{dateFormatter(doc.newReadingDate)}}
                            </th>

                        </tr>
                        <tr style="border: 0px;">
                            <th colspan="4" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 20px;padding-left: 5px !important;"><span
                                    class="no-print">អាស័យដ្ឋាន <br>Address</span>
                            </th>
                            <th colspan="9" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 10px;padding-left: 25px !important;font-size: 13px;">
                                {{trunWord(doc.customerDoc.address)}}
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 10px;padding-right: 35px;"><span
                                    class="no-print">លេខផ្លូវ/ប្លុក<br>Street No/Block</span>
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 10px;!important;font-size: 13px;padding-left: 10px;">
                                {{doc.customerDoc.streetNo}}
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 10px;padding-left: 5px !important;"><span
                                    class="no-print">លេខវិក្កយបត្រ<br>Billing No</span></th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 10px;padding-bottom: 10px;padding-left: 5px !important;font-size: 13px;">
                                {{doc.waterBillingDoc.enShortName}}{{doc.barcode}}
                            </th>
                        </tr>

                        <tr style="border: 0px;">
                            <th colspan="4" class="postInvoiceTh"
                                style="padding-top: 5px;padding-bottom: 50px !important;"><span class="no-print">លេខសំគាល់ទីតាំង <br>Delivery Point Code</span>
                            </th>
                            <th colspan="9" class="postInvoiceTh"
                                style="padding-top: 5px;padding-bottom: 50px;padding-left: 50px !important;font-size: 13px;">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 5px;padding-bottom: 50px !important;padding-right: 65px;"><span
                                    class="no-print">ប្រភេទអតិថិជន<br>Customer Type</span>
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 5px;padding-bottom: 50px; !important;font-size: 13px;padding-left: 10px;">
                                {{doc.customerDoc.categoryDoc.description}}
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 5px; padding-bottom: 50px !important;"><span class="no-print">វិក្កយបត្រប្រចាំខែ<br>Monthly Billing</span>
                            </th>
                            <th colspan="5" class="postInvoiceTh"
                                style="padding-top: 5px;padding-bottom: 50px;padding-left: 5px !important;font-size: 13px;">
                                {{doc.newReadingDate | switchMonthYearToKh}}

                            </th>
                        </tr>
                        <tr class="no-print">
                            <th colspan="8" class="heading-report" width="23%">

                                <span class="no-print">នាឡិកា/Meter</span>

                            </th>
                            <th colspan="10" class="heading-report" width="27%">
                                <span class="no-print">អំណានថ្មី/Current Reading</span>
                            </th>
                            <th colspan="9" class="heading-report" width="25%">
                                <span class="no-print">អំណានចាស់/Previous Reading</span>
                            </th>
                            <td colspan="6" class="heading-report" width="20%" style="padding-right: 0px">
                                    <span class="no-print" style="text-align: right">
                                        <b>បរិមាណទឹកប្រើប្រាស់</b> </span>

                            </td>
                        </tr>
                        <tr class="no-print">
                            <td colspan="3" class="heading-report fz12" style="text-align: left;padding-left: 0px">
                                    <span class="no-print ">
                                        <b>លេខ/No</b>
                                    </span>
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: right;">
                                    <span class="no-print">
                                        <b>ទំហំ/Diameter</b>
                                    </span>
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: center;">
                                    <span class="no-print">
                                        <b>កាលបរិច្ឆេទ/Date</b>
                                    </span>
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: center">
                                    <span class="no-print">
                                        <b>លេខអាន/Index</b>
                                    </span>
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: center">
                                    <span class="no-print">
                                        <b>កាលបរិច្ឆេទ/Date</b>
                                    </span>
                            </td>
                            <td colspan="4" class="fz12 heading-report" style="text-align: center;">
                                    <span class="no-print">
                                        <b>លេខអាន/Index</b>
                                    </span>
                            </td>
                            <td colspan="6" class="fz12 heading-report" style="text-align: center;">
                                <span class="no-print">
                                        <b>Consumption</b>
                                    </span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3"
                                style="text-align: left; padding-left: 0px;padding-right: 0px;margin-left: 3px;font-size: 11px;">
                                <div style="width: 40px !important;">
                                    {{doc.customerDoc.contract.meterSerialNo}}

                                </div>
                            </td>
                            <td colspan="4" style="text-align: right;padding-right: 0px;margin-left: 3px;">
                                <div style="width: 65px">
                                    {{doc.customerDoc.contract.meterTypeDoc.diameter}}

                                </div>
                            </td>

                            <td colspan="6" style="text-align: right;padding-left: 50px;">
                                {{dateFormatter(doc.newReadingDate)}}
                            </td>
                            <td colspan="5" style="text-align: right; padding-right: 35px;"> {{doc.newReading}} </td>
                            <td colspan="5" style="text-align: right; padding-left: 17px;">
                                {{dateFormatter(doc.prevReadingDate)}}
                            </td>
                            <td colspan="4" style="text-align: center; padding-left: 50px">
                                {{(doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType == 'Meter Reset') ? doc.oldPrevReading : doc.prevReading}}
                            </td>
                            <td colspan="6" style="text-align: center"> {{doc.waterConsumption}} </td>
                        </tr>

                        <tr class="headin-no-border" style="height: 13px;">
                            <th colspan="33">
                                <div style="height: 10px;"></div>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="17" class="heading-report">
                                <span class="no-print">បរិយាយ/Description</span>
                            </th>
                            <th colspan="5" class="heading-report">
                                <span class="no-print">បរិមាណ/Quantity</span>
                            </th>
                            <th colspan="5" class="heading-report">
                                <span class="no-print">តម្លៃឯកតា/Unit Price</span>
                            </th>
                            <th colspan="6" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់/Amount</span>
                            </th>
                        </tr>
                        </tbody>
                        <tbody class="body-border-outsite">
                        <slot v-if="doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType=='Meter Change'">
                            <tr class="fz9">
                                <td colspan="2"
                                    style="text-align: left; margin-left: 3px; font-size: 9px !important; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="15" style="font-family: 'Khmer OS System'; font-size: 9px !important">
                                    {{"តម្លៃទឹកតាមនាឡិកាស្ទង់មុន"}} &nbsp;&nbsp; <span style="font-size: 8px;">{{"OLD METERED CONSUMPTION"}}</span>
                                </td>
                                &lt;!&ndash; <td colspan="6" style="font-family: 'Khmer OS System'; font-size: 9px">
                                 </td>&ndash;&gt;
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                    {{doc.oldMeterWaterConsumption}} M3
                                </td>
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important; padding-right: 20px;">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="6"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr class="fz9">
                                <td colspan="2"
                                    style="text-align: left; margin-left: 3px; font-size: 9px !important; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="15" style="font-family: 'Khmer OS System'; font-size: 9px !important">
                                    {{'តម្លៃទឹកតាមនាឡិកាស្ទង់ថ្មី'}} &nbsp;&nbsp; <span style="font-size: 8px;">NEW METERED CONSUMPTION</span>
                                </td>
                                &lt;!&ndash;<td colspan="6" style="font-family: 'Khmer OS System'; font-size: 9px">

                                </td>&ndash;&gt;
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                    {{doc.newMeterWaterConsumption}} M3
                                </td>
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important; padding-right: 20px;">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="6"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                        </slot>
                        <slot v-else-if="doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType=='Meter Reset'">
                            <tr class="fz9">
                                <td colspan="2"
                                    style="text-align: left; margin-left: 3px; font-size: 9px !important; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="15" style="font-family: 'Khmer OS System'; font-size: 9px !important; padding-left: 0px;">នាឡិកាវិលជំុ
                                </td>
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash;{{doc.oldMeterWaterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ndash;&gt;
                                </td>
                                <td colspan="5"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="6"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                        </slot>
                        <tr class="fz9">
                            <td colspan="2"
                                style="text-align: left; margin-left: 3px; font-size: 9px !important; font-family:'segoe UI'">
                                &nbsp;7000{{checkTariff(doc.customerDoc)}}
                            </td>
                            <td colspan="15"
                                style="font-family: 'Khmer OS System'; font-size: 9px !important;padding-left: 0px;padding-right: 0px;">
                                {{ doc.isEstimated ? "តម្លៃទឹកតាមការប៉ាន់ស្មានកំរិត" : "តម្លៃទឹកតាមនាឡិកាស្ទង់កំរិត"}}{{doc.level | switchNumToKh}}

                                &nbsp;&nbsp;
                                <span style="font-size: 8px;">{{doc.isEstimated ? "ESTIMATED CONSUMPTION-TR" : "METERED CONSUMPTION-TR"}}{{doc.level}}</span>
                            </td>
                            &lt;!&ndash; <td colspan="7"
                                 style="font-family: 'Khmer OS System'; font-size: 9px;padding-left: 0px;padding-right: 0px;">

                             </td>&ndash;&gt;
                            <td colspan="5"
                                style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                {{doc.waterConsumption}} M3
                            </td>
                            <td colspan="5" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px; padding-right: 20px;">
                                {{numFormatter(doc.price)}}
                            </td>
                            <td colspan="6" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.total)}}
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="2"
                                style="text-align: left;margin-left: 3px;font-size: 9px !important; font-family:'segoe UI'">
                                &nbsp;71002
                            </td>
                            <td colspan="15"
                                style="font-family: 'Khmer OS System'; font-size: 9px !important; padding-left: 0px;padding-right: 0px; ">
                                តម្លៃថែទាំនាឡិកាស្ទង់ &nbsp;&nbsp; <span
                                    style="font-size: 8px;">METER MAINTENANCE</span>
                            </td>
                            &lt;!&ndash; <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                             </td>&ndash;&gt;
                            <td colspan="5"
                                style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                {{doc.billingCycle}} M
                            </td>
                            <td colspan="5"
                                style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important; padding-right: 20px;">
                                {{doc.maintenanceFee | numFormat}}
                            </td>
                            <td colspan="6" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.maintenanceFee | numFormat}}
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left;margin-left: 3px;font-size: 9px; font-family:'segoe UI'">
                                &nbsp;41001.97
                            </td>
                            <td colspan="14" style="font-family: 'Khmer OS System'; font-size: 9px !important">
                                វិភាគទានលូទឹកស្អុយ
                                &nbsp;&nbsp;<span style="font-size: 8px;">SEWERAGE CHARGE</span>
                            </td>
                            &lt;!&ndash;<td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px"></td>&ndash;&gt;
                            <td colspan="5"
                                style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                {{doc.waterConsumption}} M3
                            </td>
                            <td colspan="5" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px; padding-right: 20px;">
                                {{numFormatter(doc.contributionFeePrice)}}
                            </td>
                            <td colspan="6"
                                style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px !important">
                                {{numFormatter(doc.contributionFee)}}
                            </td>
                        </tr>

                        &lt;!&ndash;Add More TR (1 Row 25px)&ndash;&gt;
                        <tr :style="styleForRow(doc)">
                            <td colspan="33"></td>
                        </tr>
                        <tr style="height: 54px">
                            <td colspan="33" style="font-family:'Khmer OS System'; font-size: 9px">
                                &lt;!&ndash;ប្រាក់កក់របស់លោកអ្នក :&ndash;&gt;
                                <br>

                            </td>
                        </tr>
                        <tr>
                            <td colspan="17" class="heading-report">
                                <span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </td>
                            <td colspan="6" rowspan="2" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ
                                        <br>Amount Charged</span>
                            </td>
                            <td colspan="11" rowspan="2" valign="middle" style="text-align: right;height: 38px;"
                                class="body-border-no-left">
                                {{numFormatter(doc.grandTotal)}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report">
                                <span class="no-print">បេឡាករ/Cashier</span>
                            </td>
                            <td colspan="5" class="heading-report">
                                <span class="no-print">កាលបរិច្ឆេទ/Date</span>
                            </td>
                            <td colspan="7" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="7" class="heading-report"></td>
                            <th colspan="6" class="body-border-no-right">
                                    <span class="no-print">ជំពាក់(បង់មុន)
                                        <br>Arrears(Advances)</span>
                            </th>
                            <td class="body-border-no-left" valign="middle" style="text-align: right;height: 38px;"
                                colspan="10">
                                {{calculateBalance(doc)}}
                            </td>
                        </tr>
                        <tr style="margin: 0px">
                            <th colspan="17" class="heading-report" style="padding-bottom: 0px !important"></th>
                            <th colspan="6" class="body-border-no-right" style="padding-bottom: 0px; !important">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប
                                        <br>Total Amount</span>
                            </th>
                            <th colspan="10" style="text-align: right; height: 38px;padding-bottom: 0px !important"
                                class="body-border-no-left">
                                {{numFormatter(doc.customerDoc && doc.customerDoc.transaction && doc.customerDoc.transaction.balance)}}
                            </th>
                        </tr>
                        </tbody>
                        <tbody>
                        <tr class="headin-no-border" style="height: 10px">
                        </tr>
                        <tr class="body-border-outsite"
                            style="height: 10px; padding-top: 0px;padding-bottom: 0px; vertical-align: top;">
                            <td colspan="3"
                                style="text-align: left;margin: 0px;vertical-align: top; padding: 0px !important;">
                                <span style="font-size: 3px; height: 3px">{{userIdWithDate}}</span>
                            </td>
                            <td colspan="20" style="padding-top: 0px;padding-bottom: 0px;">
                                <span class="no-print">សូមអញ្ចើញមកបង់ប្រាក់ឲ្យបានមុនថ្ងៃ/Please pay before: </span>
                            </td>
                            <th colspan="10"
                                style="font-family: 'segoe UI;padding-top: 2px;padding-bottom: 5px; font-size: 14px;padding-left: 50px;">
                                {{add15Days(doc.newReadingDate)}}
                            </th>

                        </tr>
                        </tbody>
                        &lt;!&ndash;Bottom To Cut&ndash;&gt;
                        <tbody>
                        <tr>
                            <th colspan="33" style="text-align: center;" class=" report-title">

                                <div style="height: 99px;display:flex; align-items: flex-end; justify-content: center;">
                                </div>
                            </th>
                        </tr>
                        <tr style="height: 6px; padding: 0px ;vertical-align: bottom !important;">
                            <td colspan="4" style="text-align: left;padding: 0px !important;">
                            </td>
                            <td colspan="29" class="fz8"
                                style="text-align: right;padding-bottom: 4px;padding-top: 2px !important;">
                                {{doc.waterConsumption}} M3
                            </td>
                        </tr>
                        <tr style="border: 0">
                            <th style="border: 0px;padding-top: 0px;" class="postInvoiceTh10" colspan="3">
                                    <span class="no-print">ឈ្មេាះ
                                        <br>Name </span>
                            </th>
                            <th colspan="9"
                                class="postInvoiceTh10"
                                style="font-family: Khmer OS Battambang;font-size: 12px;padding-bottom: 5px; padding-top: 5px; padding-left: 15px  !important;" valign="middle"
                            >
                                {{doc.customerDoc.khName}}
                            </th>

                            <th style="border: 0px;padding-bottom:0px;padding-top: 0px" colspan="2"
                                class="postInvoiceTh10">
                                    <span class="no-print">លេខអតិថិជន
                                        <br>Customer No</span>
                                <br>
                            </th>
                            <td style="border: 0px;text-align: center;padding-bottom: 5px; padding-top: 5px;padding-left: 60px;"
                                colspan="4" valign="middle"
                                class="headin-no-border postInvoiceTh10">
                                {{doc.customerDoc._id}}
                            </td>

                            <td style="border: 0px;" colspan="3" class="postInvoiceTh10">
                                    <span class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ
                                        <br>Billing Date</span>
                            </td>
                            <td style="border: 0px; text-align: right;;padding-bottom: 5px; padding-top: 5px;;padding-left: 40px"
                                valign="middle" colspan="5"
                                class="headin-no-border postInvoiceTh10">
                                {{dateFormatter(doc.newReadingDate)}}
                            </td>
                            <th colspan="8" rowspan="2" style="text-align: right;" valign="top"
                                class="fz8">
                                <posted-meter-reading-journal-component
                                        :doc="doc"></posted-meter-reading-journal-component>
                            </th>
                        </tr>

                        <tr style="border: 0px;padding-bottom:0px;">
                            <td style="border: 0px;padding-bottom: 15px; padding-top: 0px;" colspan="4"
                                class="postInvoiceTh10">
                                    <span class="no-print">លេខសំគាល់ទីតាំង
                                        <br>Delivery Point Code</span>
                            </td>
                            <td style="border: 0px;text-align: center;padding-bottom: 15px; padding-top:0px;padding-left: 20px"
                                colspan="9"
                                valign="middle"
                                class="headin-no-border postInvoiceTh10">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <th colspan="2" class="postInvoiceTh10"
                                style="padding-bottom: 15px; padding-top: 0px;"><span
                                    class="no-print">ថ្ងៃផុតកំណត់<br>Expired Date</span>
                            </th>
                            <th colspan="4" class="postInvoiceTh10"
                                style="padding-bottom: 15px; padding-top: 0px;padding-left: 60px;text-align: left">
                                {{add15Days(doc.newReadingDate)}}
                            </th>
                            <th colspan="3" class="postInvoiceTh10"
                                style="padding-bottom: 15px; padding-top: 0px;"><span
                                    class="no-print">វិក្កយបត្រប្រចាំខែ<br>Monthly Billing</span>
                            </th>
                            <th colspan="5" class="postInvoiceTh10"
                                style="text-align: left;padding-bottom: 15px; padding-top: 0px;padding-left: 40px;">
                                {{doc.newReadingDate | switchMonthYearToKh}}

                            </th>
                        </tr>
                        </tbody>
                        <tbody>
                        <tr style="vertical-align: top;padding-bottom: 0px;">
                            <th colspan="17" class="heading-report">
                                <span style="font-size: 3px;margin: 0px; float: left">{{userIdWithDate}}</span>
                                <span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </th>
                            <th colspan="6" rowspan="2" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ
                                        <br>Amount Charged</span>
                            </th>
                            <td colspan="10" rowspan="2" class="body-border-no-left" style="text-align: right">
                                {{numFormatter(doc.grandTotal)}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report">
                                <span class="no-print">បេឡាករ/Cashier</span>
                            </td>
                            <td colspan="5" class="heading-report">
                                <span class="no-print">កាលបរិច្ឆេទ/Date</span>
                            </td>
                            <td colspan="7" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span>
                            </td>
                        </tr>
                        <tr style="padding-top: 1px;">
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="7" class="heading-report" style="text-align: right"></th>
                            <th colspan="6" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប
                                        <br>Total Amount</span>
                            </th>
                            <th colspan="10" class="body-border-no-left" valign="top"
                                style="text-align: right;padding-top: 16px;">
                                {{numFormatter(doc.customerDoc && doc.customerDoc.transaction && doc.customerDoc.transaction.balance)}}
                            </th>

                        </tr>
                        </tbody>

                    </table>
                </div>

            </div>

            &lt;!&ndash;<th colspan="5" style="text-align: right">
                            <posted-meter-reading-journal-component
                                    :doc="doc"></posted-meter-reading-journal-component>
                        </th>&ndash;&gt;
            &lt;!&ndash;Modal&ndash;&gt;
            <div class="container demo">
                &lt;!&ndash; Modal &ndash;&gt;
                <div class="modal left fade" id="postInvoice" tabindex="-1" role="dialog"
                     aria-labelledby="postInvoiceLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title" id="postInvoiceLabel">
                                    <i class="fa fa-filter"></i>
                                    Post Invoice Filter</h4>
                            </div>

                            <div class="modal-body">
                                <el-form :rules="rules" ref="postedInvoice" :label-position="labelPosition"
                                         label-width="100px" :model="postInvoice">
                                    &lt;!&ndash;<el-row>&ndash;&gt;
                                    <el-form-item label="Date" prop="dateRange">
                                        <el-date-picker v-model="dateRange" type="daterange" align="right"
                                                        placeholder="Pick a range" :picker-options="pickerOptions2">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="Meter Query">
                                        <el-select style="width: 223px" v-model="postInvoice.meterQuery"
                                                   clearable placeholder="Select">
                                            <el-option v-for="item in meterQueryOptions" :key="item.value"
                                                       :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    &lt;!&ndash;</el-row>&ndash;&gt;
                                    <el-form-item label="Customer">
                                        <el-select style="width: 223px" class="customer-select"
                                                   v-model="postInvoice.customer" multiple filterable="" remote
                                                   placeholder="Please enter a keyword" :remote-method="remoteMethod"
                                                   :loading="loading">
                                            <el-option v-for="item in customers" :key="item.value" :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <p>Customer Count: {{countCustomerInBlock}}</p>
                                    <el-form-item label="Range (1-300)">
                                        <el-input type="text" v-model="printRange" placeholder="1-300"></el-input>
                                    </el-form-item>
                                    &lt;!&ndash;<el-form-item label="Print QTY">&ndash;&gt;
                                    &lt;!&ndash;<el-select v-model="limit" placeholder="Select">&ndash;&gt;
                                    &lt;!&ndash;<el-option v-for="item in limitOptions" :key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label" :value="item.value">&ndash;&gt;
                                    &lt;!&ndash;</el-option>&ndash;&gt;
                                    &lt;!&ndash;</el-select>&ndash;&gt;
                                    &lt;!&ndash;</el-form-item>&ndash;&gt;
                                    &lt;!&ndash;<el-form-item label="Print Count">&ndash;&gt;
                                    &lt;!&ndash;<el-select v-model="printedCount" placeholder="Select">&ndash;&gt;
                                    &lt;!&ndash;<el-option v-for="item in printedCountOptions" :key="item.value"&ndash;&gt;
                                    &lt;!&ndash;:label="item.label" :value="item.value">&ndash;&gt;
                                    &lt;!&ndash;</el-option>&ndash;&gt;
                                    &lt;!&ndash;</el-select>&ndash;&gt;
                                    &lt;!&ndash;</el-form-item>&ndash;&gt;
                                    <el-form-item>
                                        <el-checkbox v-model="printed">មិនព្រីនវិក័យប័ត្រដែលបានព្រីនហើយ</el-checkbox>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading"
                                                   @click.native="queryPostInvoice('postedInvoice')">Run
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>

                        </div>
                        &lt;!&ndash; modal-content &ndash;&gt;
                    </div>
                    &lt;!&ndash; modal-dialog &ndash;&gt;
                </div>
                &lt;!&ndash; modal &ndash;&gt;

            </div>
            &lt;!&ndash; container &ndash;&gt;
            &lt;!&ndash;End Modal&ndash;&gt;
        </div>
    </div>
</template>

<script>
    import PostedMeterReadingJournalComponent from '/imports/vue/components/print/PostedMeterReadingJournalComponent.vue';
    import numeral from 'numeral';
    import {WB_waterBillingSetup} from '../../../collection/waterBillingSetup';
    import _ from 'lodash';

    export default {
        components: {
            PostedMeterReadingJournalComponent
        },
        data() {
            return {
                limit: 50,
                countCustomerInBlock: 0,
                printRange: null,
                printedCount: 0,
                printedCountOptions: this.printedCountOptionsArray(),
                limitOptions: [
                    {
                        label: '50', value: 50
                    }, {
                        label: '100', value: 100
                    },
                    {
                        label: '200', value: 200
                    }
                ],
                printed: true, //status for check dont print posted invoice which already print,
                rules: {},
                fullscreenLoading: false,
                meterQueryOptions: [],
                company: null,
                userIdWithDate: Meteor.user().username + "-" + moment().format("DD/MM/YYYY"),
                //date picker
                pickerOptions2: {
                    shortcuts: [
                        //                        {
                        //                        text: 'Last week',
                        //                        onClick(picker) {
                        //                            const end = new Date();
                        //                            const start = new Date();
                        //                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        //                            picker.$emit('pick', [start, end]);
                        //                        }
                        //                    },
                        {
                            text: 'Last month',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: 'Last 3 months',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                dateRange: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
                //form data
                labelPosition: 'right',
                customers: [],
                loading: false,
                postInvoice: {
                    customer: [],
                    meterQuery: '',
                },
                //end form data
                reportData: [],
            };
        },
        watch: {
            'postInvoice.meterQuery'(val) {
                let obj = JSON.parse(val);
                let selector = {
                    district: obj.district,
                    quartier: obj.quartier,
                    block: obj.block,
                    position: 'active'
                }
                Meteor.call('countAvailableMeterReadingJournalDetail', selector, (err, result) => {
                    if (!err)
                        this.countCustomerInBlock = result;

                })
            }
        },
        methods: {
            printInvoice() {
                window.print();
            },
            add15Days(date) {
                return moment(date).add('15', 'days').format('DD/MM/YYYY');
            },
            styleForRow(doc) {
                let height = '230px';
                if (doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType == 'Meter Change') {
                    height = 230 - (20 * 2) + 'px';
                }else if (doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType == 'Meter Reset') {
                    height = (230 - 20) + 'px';
                }

                return {height: height}
            },
            checkTariff(customerDoc) {
                let code;
                switch (customerDoc.tariffDoc && customerDoc.tariffDoc.code) {
                    case '1':
                        code = '2';
                        break;
                    case '2':
                        code = '1'
                        break;
                    case '3':
                        code = '3'
                        break;
                    default:
                        code = '1';
                }
                return code;
            },
            trunWord(val) {
                return _.truncate(val, {'length': 11,});
            },
            calculateBalance(row) {
                let currentTotal = row.grandTotal;
                let balance = row.customerDoc && row.customerDoc.transaction && row.customerDoc.transaction.balance || 0;
                return balance == 0 ? balance : numeral(Math.abs(balance - currentTotal)).format('0,0.00');
            },
            printedCountOptionsArray() {
                let list = [];
                for (let i = 0; i <= 10; i++) {
                    list.push({label: `${i}`, value: i})
                }
                return list;
            },
            lookupMeterQuery({selector}) {
                Meteor.call('meterQueryOptions', {selector}, (err, result) => {
                    if (!err) {
                        this.meterQueryOptions = result;
                    }
                });
            },
            queryPostInvoice(formName) {
                this.reportData = []; //clear data before summit again
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let skip = 0;
                        let limit = this.countCustomerInBlock;
                        let obj = JSON.parse(this.postInvoice.meterQuery);
                        let selector = {
                            district: obj.district,
                            block: obj.block,
                            quartier: obj.quartier
                        };

//                        console.log(selector)
                        if (!!this.printRange) {
                            let splitRange = this.printRange.split('-');
                            if (splitRange.length > 1 && splitRange.length == 2) {
                                skip = +splitRange[0] - 1 < 0 ? 0 : +splitRange[0] - 1;
                                limit = +splitRange[1] == 0 ? this.countCustomerInBlock : skip == 0 ? +splitRange[1] : +splitRange[1] - skip;
                                console.log(skip, limit)
                                if (skip > +splitRange[1]) {
                                    this.$message.warning('Start Range must < End Range ');
                                    return
                                }
                            } else {
                                this.$message.warning('Range must be in this form 1-300');
                                return;
                            }
                        } else {
                            this.$message.warning('Range must input');
                            return;
                        }
                        if (this.printed) {
                            selector.printed = {$ne: this.printed}
                        }
                        if (this.dateRange.length > 0) {
                            selector.newReadingDate = {
                                $gte: this.dateRange[0],
                                $lte: this.dateRange[1]
                            }
                        }
                        if (this.postInvoice.customer.length > 0) {
                            selector.customerId = {$in: this.postInvoice.customer}
                        }
                        //excute the query if daterange && meter query or customer has value
                        selector.written = true;
                        selector.printedCount = {$gte: this.printedCount};
                        selector.waterConsumption = {$gt: 0};
                        selector.assignedUsers = {$in: [Meteor.userId()]};
                        if ((this.dateRange.length > 0) && this.postInvoice.meterQuery.length > 0 || this.postInvoice.customer.length > 0) {
                            this.fetchPostedMeterReadingJournalDetailById({selector, skip, limit})
                        }
                    } else {
                        console.log("Error Submt")
                    }
                });
            },
            //query customer
            remoteMethod(query) {
                if (!!query) {
                    this.loading = true;
                    setTimeout(() => {
                        let lists = [];
                        this.loading = false;
                        Meteor.call('lookupCustomer', query, (err, result) => {
                            if (!err) {
                                result.forEach(function (customer) {
                                    lists.push({label: `${customer.khName}`, value: customer._id})
                                });
                                this.customers = lists;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    this.options4 = [];
                }
            },
            fetchPostedMeterReadingJournalDetailById({selector, skip, limit}) {
                this.fullscreenLoading = true;
                this.company = FlowRouter.query.get('comp');
                setTimeout(() => {
                    Meteor.call('fetchPostedMeterReadingJournalDetailById', {
                        selector,
                        skip,
                        limit
                    }, (err, result) => {
                        if (!err) {
                            this.reportData = result;
                        }
                    });
                    this.fullscreenLoading = false;
                    //                    $('.modal').close()
                }, 1000);
            },
            dateFormatter(date) {
                return moment(date).format('DD/MM/YYYY')
            },
            numFormatter(val) {
                return numeral(val).format('0,0.00')
            },
            ceilingFormatter(val) {
                return numeral(val).format('0,0')
            },
            generateBarcodeId(doc) {
                return `barcode${doc._id}`;
            },
            isOldBlockExist(doc) {
//                if (doc.newCustomerSuffix) {
//                    return doc.newCustomerId + doc.newCustomerSuffix;
//                }
                let dpcArr = doc.dpc.split('');
                let subDpc = dpcArr[0] + dpcArr[1] + " " + dpcArr[2] + dpcArr[3] + " " + dpcArr[4] + dpcArr[5] + " " + doc.folio + " " + doc.successor;
                return subDpc;
            },
            printPostedInvoice() {
                window.print();
            },
            postedInvoiceIsZero() {
                return this.reportData.length <= 0
            }
        },
        computed: {
            generateBarcodeSvg(doc) {
                return `barcode${doc._id}`;
            },
        },
        //life cycle
        created() {
            let mrjdId = FlowRouter.query.get('mrjd'); //mrjd = Meter Readiing Journal Detail
            if (mrjdId) {
                let selector = {_id: mrjdId};
                this.fetchPostedMeterReadingJournalDetailById({selector, skip: 0, limit: 1});
            }
            this.lookupMeterQuery({selector: {assignUser: {$in: [Meteor.userId()]}}})
        },
        mounted() {
            document.body.style.backgroundColor = "white";
            $('.post-invoice').sideNav({
                    menuWidth: 500, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    draggable: true // Choose whether you can drag to open on touch screens
                }
            );
        }
    }
</script>

<style scoped lang="less">
    @s-normal: normal !important;

    /*@page {*/

    /*size: A4;*/

    /*margin-left: 0cm;*/

    /*margin-right: 0cm;*/

    /*}*/

    .b-top-bottom {
        border-top: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    .report-title {
        font-family: "Khmer OS System";
        font-size: 50px;
    }

    table {
        width: 100%;
    }

    tr,
    td {
        padding: 5px;
    }

    .f-normal {
        font-weight: normal !important;
    }

    .fz15 {
        font-size: 15px !important;
    }

    .fz14 {
        font-size: 14px !important;
    }

    .fz13 {
        font-size: 13px !important;
    }

    .fz12 {
        font-size: 12px !important;
    }

    .fz9 {
        font-size: 9px !important;
    }

    .fz8 {
        font-size: 8px !important;
    }

    .fz18 {
        font-size: 18px !important;
    }

    .mg-top {
        // margin-top: 3.2cm !important;
    }

    .mg-top39 {
        margin-top: 1.9cm !important;
    }

    .mg-top8 {
        margin-top: 0.5cm !important;
    }

    .mg-top10 {
        margin-top: 1.7cm !important;
    }

    /*tr.mg-left {*/

    /*margin-left: 200px !important;*/

    /*}*/

    div.report-layout {
        width: 297mm;
        margin: 0 auto;
    }

    div.picture {
        background-image: url(images/posted-invoice.jpg)
    }
</style>
-->
