<!--<template>
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
                     style="padding-left: 10px;padding-right: 10px; ;margin-top: 2.4cm;page-break-after:always; overflow: none;">
                    <table width="100%">
                        <tbody>
                        <tr style="border: 0px">
                            <th style="border: 0px">
                                    <span class="no-print">ឈ្មេាះ
                                        <br>Name </span>
                            </th>
                            <th style="border: 0px; text-align: left;vertical-align: bottom;" colspan="12" class="fz12">
                                &nbsp;&nbsp;
                                <span style="font-family: 'Khmer OS Muol'; font-size: 11px;">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.khName}}</span>
                                <br> &nbsp;&nbsp;
                                <span style="font-family: 'segoe UI'; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {{doc.customerDoc.name}}</span>
                            </th>
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">លេខអតិថិជន
                                        <br>Customer No</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="7" class="headin-no-border fz12">
                                {{doc.customerDoc._id}}
                            </td>
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ
                                        <br>Billing Date</span>
                            </th>
                            <td style="border: 0px; text-align: left" colspan="10" class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dateFormatter(doc.newReadingDate)}}
                            </td>
                        </tr>

                        <tr style="border: 0px">
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">លេខផ្លូវ
                                        <br>Street No</span>
                            </th>
                            <td style="border: 0px; text-align: center; width: 85px; !important;" colspan="4"
                                class="headin-no-border fz12">
                                &nbsp;{{doc.customerDoc.streetNo}}
                            </td>
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">លេខផ្ទះ
                                        <br>House No</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="5;" class="headin-no-border fz12">
                                &nbsp;{{trunWord(doc.customerDoc.address)}}
                            </td>
                            <th style="border: 0px" colspan="3">
                                    <span class="no-print">លេខសំគាល់ទីតាំង
                                        <br>Delivery Point Code</span>
                            </th>
                            <td style="border: 0px; text-align: left;" colspan="6" class="headin-no-border fz12">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <th style="border: 0px;" colspan="2">
                                    <span class="no-print">លេខវិក្កយបត្រ
                                        <br>Bill No</span>
                            </th>
                            <td style="border: 0px; text-align: left;" colspan="10" class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.waterBillingDoc.enShortName}}{{doc.barcode}}
                            </td>
                        </tr>
                        <tr style="height: 10px">
                            <td colspan="34"></td>
                        </tr>
                        <tr style="border: 0px;">
                            <th style="border: 0px" class="fz12">
                                <span class="no-print">P1</span>

                            </th>
                            <td colspan="2" style="text-align: left">
                                &nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.contract.tableOrRoom}}
                            </td>
                            <th style="border: 0px" class="fz12" colspan="2">
                                <span class="no-print">P2</span>
                            </th>
                            <td colspan="3" style="text-align: left">
                                &nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.contract.familyHeadCount}}
                            </td>
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">អត្រា
                                        <br>Tariff</span>
                            </th>
                            <td style="border: 0px;text-align: left;" class="headin-no-border fz12" colspan="4">
                                {{doc.customerDoc.categoryDoc.code}}-{{doc.customerDoc.tariffDoc.code}}
                            </td>
                            <th style="border: 0px" colspan="2">
                                    <span class="no-print">រយៈពេលពី
                                        <br>Period From</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="7" class="headin-no-border fz12">
                                {{dateFormatter(doc.prevReadingDate)}}
                            </td>
                            <th style="border: 0px" colspan="1">
                                    <span class="no-print">ដល់
                                        <br>To</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="10" class="headin-no-border fz12">
                                {{dateFormatter(doc.newReadingDate)}}
                            </td>
                        </tr>
                        <tr style="border: 0px; height: 8px">
                            <td colspan="34">
                                <div style="height: 2px;">

                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="7" class="heading-report" width="20%">
                                <span class="no-print">នាឡិកា/Meter</span>
                            </th>
                            <th colspan="10" class="heading-report" width="37%">
                                <span class="no-print">អំណានថ្មី/Current Reading</span>
                            </th>
                            <th colspan="10" class="heading-report" width="28%">
                                <span class="no-print">អំណានចាស់/Previous Reading</span>
                            </th>
                            <td colspan="7" rowspan="2" class="heading-report" width="15%" style="padding-right: 0px">
                                    <span class="no-print" style="text-align: right">
                                        <b>បរិមាណទឹកប្រើប្រាស់</b>
                                        <br>Consumption</span>
                                <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.waterConsumption}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="heading-report fz12" style="text-align: left;padding-left: 0px">
                                    <span class="no-print ">
                                        <b>លេខ/No</b>
                                    </span>
                                <br>{{doc.customerDoc.contract.meterSerialNo}}
                            </td>
                            <td colspan="4" class="fz12 heading-report" style="text-align: right;">
                                    <span class="no-print">
                                        <b>ទំហំ/Diameter</b>
                                    </span>
                                <br>&nbsp;&nbsp;&nbsp;{{doc.customerDoc.contract.meterTypeDoc.diameter}}
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: right;">
                                    <span class="no-print">
                                        <b>កាលបរិច្ឆេទ/Date</b>
                                    </span>
                                <br>{{dateFormatter(doc.newReadingDate)}}&nbsp;&nbsp;
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: center">
                                    <span class="no-print">
                                        <b>លេខអាន/Index</b>
                                    </span>
                                <br>&nbsp;&nbsp;&nbsp;&nbsp;{{doc.newReading}}
                            </td>
                            <td colspan="5" class="fz12 heading-report" style="text-align: center">
                                    <span class="no-print">
                                        <b>កាលបរិច្ឆេទ/Date</b>
                                    </span>
                                <br>{{dateFormatter(doc.prevReadingDate)}}&nbsp;
                            </td>
                            <td colspan="6" class="fz12 heading-report" style="text-align: center;">
                                    <span class="no-print">
                                        <b>លេខអាន/Index</b>
                                    </span>
                                <br>&nbsp;&nbsp;&nbsp;&nbsp;{{(doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType == 'Meter Reset') ? doc.oldPrevReading : doc.prevReading}}
                            </td>
                        </tr>
                        <tr class="headin-no-border" style="height: 13px;">
                            <th colspan="34">
                                <div style="height: 10px;"></div>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="18" class="heading-report">
                                <span class="no-print">បរិយាយ/Description</span>
                            </th>
                            <th colspan="2" class="heading-report">
                                <span class="no-print">បរិមាណ/Quantity</span>
                            </th>
                            <th colspan="9" class="heading-report">
                                <span class="no-print">តម្លៃឯកតា/Unit Price</span>
                            </th>
                            <th colspan="7" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់/Amount</span>
                            </th>
                        </tr>
                        </tbody>
                        <tbody class="body-border-outsite">
                        <slot v-if="doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType=='Meter Change'">
                            <tr class="fz9">
                                <td colspan="3"
                                    style="text-align: left; margin-left: 10px; font-size: 9px; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    {{"តម្លៃទឹកតាមនាឡិកាស្ទង់មុន"}}
                                </td>
                                <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    {{"OLD METERED CONSUMPTION"}}
                                </td>
                                <td colspan="2"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    {{doc.oldMeterWaterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="9"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="7"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr class="fz9">
                                <td colspan="3"
                                    style="text-align: left; margin-left: 10px; font-size: 9px; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    {{'តម្លៃទឹកតាមនាឡិកាស្ទង់ថ្មី'}}
                                </td>
                                <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    NEW METERED CONSUMPTION
                                </td>
                                <td colspan="2"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    {{doc.newMeterWaterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="9"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="7"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                        </slot>
                        <slot v-else-if="doc.hasOldMeterWaterConsumption && doc.meterChangeType && doc.meterChangeType=='Meter Reset'">
                            <tr class="fz9">
                                <td colspan="3"
                                    style="text-align: left; margin-left: 10px; font-size: 9px; font-family:'segoe UI'">
                                    &nbsp;7000{{checkTariff(doc.customerDoc)}}
                                </td>
                                <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    {{"នាឡិកាវិលជំុ"}}
                                </td>
                                <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">
                                    {{"នាឡិកាវិលជំុ"}}
                                </td>
                                <td colspan="2"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash;{{doc.oldMeterWaterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ndash;&gt;
                                </td>
                                <td colspan="9"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.price)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td colspan="7"
                                    style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                    &lt;!&ndash; {{numFormatter(doc.total)}} &ndash;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                        </slot>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left; margin-left: 10px; font-size: 9px; font-family:'segoe UI'">
                                &nbsp;7000{{checkTariff(doc.customerDoc)}}
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                {{ doc.isEstimated ? "តម្លៃទឹកតាមការប៉ាន់ស្មានកំរិត" : "តម្លៃទឹកតាមនាឡិកាស្ទង់កំរិត"}}{{doc.level | switchNumToKh}}
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.isEstimated ? "ESTIMATED CONSUMPTION-TR" : "METERED CONSUMPTION-TR"}}{{doc.level}}
                            </td>
                            <td colspan="2" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.waterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="9" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.price)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="7" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.total)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left;margin-left: 10px;font-size: 9px; font-family:'segoe UI'">&nbsp;71002
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                តម្លៃថែទាំនាឡិកាស្ទង់
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">METER MAINTENANCE
                            </td>
                            <td colspan="2" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.billingCycle}} M &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="9" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.maintenanceFee | numFormat}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="7" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.maintenanceFee | numFormat}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left;margin-left: 10px;font-size: 9px; font-family:'segoe UI'">
                                &nbsp;41001.97
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">វិភាគទានលូទឹកស្អុយ
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">SEWERAGE CHARGE</td>
                            <td colspan="2" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.waterConsumption}} M3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="9" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.contributionFeePrice)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td colspan="7" style="text-align: right;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.contributionFee)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                        </tr>

                        &lt;!&ndash;Add More TR (1 Row 25px)&ndash;&gt;
                        <tr :style="styleForRow(doc)">
                            <td colspan="34"></td>
                        </tr>
                        <tr style="height: 60px">
                            <td colspan="34" style="font-family:'Khmer OS System'; font-size: 9px">
                                &lt;!&ndash;ប្រាក់កក់របស់លោកអ្នក :&ndash;&gt;
                                <br>

                            </td>
                        </tr>
                        <tr>
                            <td colspan="18" class="heading-report">
                                <span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </td>
                            <td colspan="10" rowspan="2" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ
                                        <br>Amount Charged</span>
                            </td>
                            <td colspan="6" rowspan="2" valign="middle" style="text-align: right;height: 38px;"
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
                            <td colspan="8" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="8" class="heading-report"></td>
                            <th colspan="10" class="body-border-no-right">
                                    <span class="no-print">ជំពាក់(បង់មុន)
                                        <br>Arrears(Advances)</span>
                            </th>
                            <td class="body-border-no-left" valign="middle" style="text-align: right;height: 38px;"
                                colspan="6">
                                {{calculateBalance(doc)}}
                            </td>
                        </tr>
                        <tr style="margin: 0px">
                            <th colspan="18" class="heading-report" style="padding-bottom: 0px !important"></th>
                            <th colspan="10" class="body-border-no-right" style="padding-bottom: 0px; !important">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប
                                        <br>Total Amount</span>
                            </th>
                            <th colspan="6" style="text-align: right; height: 38px;padding-bottom: 0px !important" class="body-border-no-left">
                                {{numFormatter(doc.customerDoc && doc.customerDoc.transaction && doc.customerDoc.transaction.balance)}}
                            </th>
                        </tr>
                        </tbody>
                        <tbody>
                        <tr class="headin-no-border" style="height: 10px">
                        </tr>
                        <tr class="body-border-outsite"
                            style="height: 10px; padding-top: 0px;padding-bottom: 0px; vertical-align: top;">
                            <td colspan="5"
                                style="text-align: left;margin: 0px;vertical-align: bottom; padding: 0px !important;">
                                <br>
                                <span style="font-size: 3px; height: 3px">{{userIdWithDate}}</span>
                            </td>
                            <td colspan="14" style="padding-top: 0px;padding-bottom: 0px;">
                                <span class="no-print">សូមអញ្ចើញមកបង់ប្រាក់ឲ្យបានមុនថ្ងៃ/Please pay before: </span>
                            </td>
                            <th colspan="17"
                                style="font-family: 'segoe UI;padding-top: 5px;padding-bottom: 1px; font-size: 14px;padding-left: 40px;">
                                {{add15Days(doc.newReadingDate)}}
                            </th>
                        </tr>
                        </tbody>
                        &lt;!&ndash;Bottom To Cut&ndash;&gt;
                        <tbody>
                        <tr>
                            <th colspan="20" style="text-align: center;" class=" report-title">

                                <div style="height: 92px;display:flex; align-items: flex-end; justify-content: center;">
                                </div>
                            </th>
                        </tr>
                        <tr style="height: 6px; padding: 0px ;vertical-align: bottom !important;">
                            <td colspan="5" style="text-align: left;padding: 0px !important;">
                            </td>
                            <td colspan="29" class="fz8"
                                style="text-align: right;padding-bottom: 4px;padding-top: 2px !important;">
                                {{doc.waterConsumption}} M3
                            </td>

                        </tr>
                        <tr style="border: 0">
                            <th style="border: 0px">
                                    <span class="no-print">ឈ្មេាះ
                                        <br>Name </span>
                            </th>
                            <th style="border: 0px;text-align: left" colspan="12" class="fz12">
                                &nbsp;&nbsp;
                                <span style="font-family: 'Khmer OS Muol'; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.khName}}</span>
                                <br> &nbsp;&nbsp;
                                <span style="font-family: 'segoe UI'; font-size: 11px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.name}}</span>
                            </th>
                            <td style="border: 0px;text-align: right" colspan="3">
                                    <span class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ
                                        <br>Billing Date</span>
                            </td>
                            <td style="border: 0px; text-align: left;" valign="middle" colspan="8"
                                class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dateFormatter(doc.newReadingDate)}}
                            </td>
                            <th colspan="10" rowspan="2" style="text-align: right;" valign="top" class="fz8">
                                <posted-meter-reading-journal-component
                                        :doc="doc"></posted-meter-reading-journal-component>
                            </th>
                        </tr>

                        <tr style="border: 0px;padding-bottom:0px;">
                            <th style="border: 0px;padding-bottom:0px;" colspan="3">
                                    <span class="no-print">លេខអតិថិជន
                                        <br>Customer No</span>
                                <br>
                                <span style="font-size: 3px;margin: 0px">{{userIdWithDate}}</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="10" valign="middle"
                                class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc._id}}
                            </td>
                            <td style="border: 0px" colspan="3">
                                    <span class="no-print">លេខសំគាល់ទីតាំង
                                        <br>Delivery Point Code</span>
                            </td>
                            <td style="border: 0px;text-align: left" colspan="5" valign="middle"
                                class="headin-no-border fz12">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <th style="border: 0px;text-align: right" colspan="3">
                                    <span class="no-print">លេខវិក្កយបត្រ
                                        <br>Bill No</span>
                            </th>
                        </tr>
                        &lt;!&ndash; <tr style="height: 5px;">
                                     <td colspan="34">
                                         <span
                                                 style="font-size: 3px;margin: 0px">{{userIdWithDate}}</span>
                                     </td>
                                 </tr>&ndash;&gt;
                        </tbody>
                        <tbody>
                        <tr style="vertical-align: top;padding-bottom: 0px;">
                            <th colspan="18" class="heading-report">
                                <span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </th>
                            <th colspan="10" rowspan="2" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ
                                        <br>Amount Charged</span>
                            </th>
                            <td colspan="6" rowspan="2" class="body-border-no-left" style="text-align: right">
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
                            <td colspan="8" class="heading-report">
                                <span class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span>
                            </td>
                        </tr>
                        <tr style="padding-top: 1px;">
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="8" class="heading-report" style="text-align: right"></th>
                            <th colspan="10" class="body-border-no-right">
                                    <span class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប
                                        <br>Total Amount</span>
                            </th>
                            <th colspan="6" class="body-border-no-left" valign="top"
                                style="text-align: right;padding-top: 12px;">
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
                if (doc.hasOldMeterWaterConsumption) {
                    height = 230 - (20 * 2) + 'px';
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
</style>-->
