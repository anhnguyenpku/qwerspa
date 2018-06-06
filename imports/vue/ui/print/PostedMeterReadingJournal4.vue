<!--
<template>
    <div class="print-posted-meter-reading">
        <div class="no-print">
            &lt;!&ndash;Side bar filter&ndash;&gt;

            &lt;!&ndash;End sidebar filter&ndash;&gt;
            &lt;!&ndash;<div slot="header" class="no-print">
                <el-row type="flex" justify="center">
                    <el-col :span="13">
                        <button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">
                            Customize
                        </button>
                        <button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">
                            Customize
                        </button>
                    </el-col>
                </el-row>
            </div>&ndash;&gt;
        </div>
        <div class="A4">
            &lt;!&ndash;<div class="sheet padding-3mm">&ndash;&gt;
            <div class="sheet">
                <div class="picture"></div>
                <div v-show="postedInvoiceIsZero()">
                    <br>
                    <p style="text-align: center">No Data</p>
                </div>
                <div v-for="doc in reportData">
                    <table>
                        <thead>
                        <tr>
                            <th colspan="34" style="text-align: center;"
                                class="report-title">
                                <div style="height: 60px;display:flex; align-items: flex-end; justify-content: center;">
                                    <span class="no-print">
                                    អង្គភាពរដ្ឋាករទឹកបាត់ដំបង <br>Battambang Water Supply
                                    </span>
                                </div>
                            </th>
                        </tr>
                        <tr style="border: 0px">
                            <th style="border: 0px"><span
                                    class="no-print">ឈ្មេាះ<br>Name  </span>
                            </th>
                            <th style="border: 0px; text-align: left;vertical-align: bottom;" colspan="12" class="fz12">
                                &nbsp;&nbsp;<span
                                    style="font-family: 'Khmer OS Muol'; font-size: 11px">{{doc.customerDoc.khName}}</span>
                                <br>
                                &nbsp;&nbsp;<span
                                    style="font-family: 'segoe UI'; font-size: 11px">{{doc.customerDoc.name}}</span>
                            </th>

                            <th style="border: 0px" colspan="3"><span class="no-print">លេខអតិថិជន<br>Customer No</span>
                            </th>
                            <td style="border: 0px;text-align: left;" colspan="7" class="headin-no-border fz12">
                                {{doc.customerDoc._id}}
                            </td>
                            <th style="border: 0px" colspan="3"><span
                                    class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ<br>Billing Date</span></th>
                            <td style="border: 0px; text-align: left" colspan="8" class="headin-no-border fz12">
                                {{dateFormatter(doc.newReadingDate)}}
                            </td>
                        </tr>

                        <tr style="border: 0px">
                            <th style="border: 0px" colspan="2"><span class="no-print">លេខផ្លូវ<br>Street No</span></th>
                            <td style="border: 0px; text-align: left;" colspan="3" class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;{{doc.customerDoc.streetNo}}
                            </td>
                            <th style="border: 0px" colspan="2"><span
                                    class="no-print">លេខផ្ទះ <br>House No</span>
                            </th>
                            <td style="border: 0px;text-align: center;" colspan="6;" class="headin-no-border fz12">
                                {{doc.customerDoc.folio}}
                            </td>
                            <th style="border: 0px" colspan="4"><span class="no-print">លេខសំគាល់ទីតាំង<br>Delivery Point Code</span>
                            </th>
                            <td style="border: 0px; text-align: left;" colspan="6" class="headin-no-border fz12">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <th style="border: 0px;" colspan="3"><span class="no-print">លេខវិក្កយបត្រ<br>Bill No</span>
                            </th>
                            <td style="border: 0px; text-align: left;" colspan="8" class="headin-no-border fz12">
                                {{doc.barcode}}
                            </td>
                        </tr>
                        <tr style="border: 0px; height: 15px">
                            <td colspan="34"></td>
                        </tr>
                        <tr style="border: 0px;">
                            <th style="border: 0px" class="fz12"><span class="no-print">P1</span>

                            </th>
                            <td colspan="2" style="text-align: left">
                                {{doc.customerDoc.contract.tableOrRoom}}
                            </td>
                            <th style="border: 0px" class="fz12"><span class="no-print">P2</span>
                            </th>
                            <td colspan="3" style="text-align: left">
                                {{doc.customerDoc.contract.familyHeadCount}}
                            </td>
                            <th style="border: 0px" colspan="2"><span class="no-print">អត្រា<br>Tariff</span></th>
                            <td style="border: 0px;text-align: center;" class="headin-no-border fz12" colspan="5">
                                {{doc.customerDoc.tariff}}
                            </td>
                            <th style="border: 0px" colspan="3"><span class="no-print">រយៈពេលពី<br>Period From</span>
                            </th>
                            <td style="border: 0px;text-align: center;" colspan="6" class="headin-no-border fz12">
                                {{dateFormatter(doc.prevReadingDate)}}
                            </td>

                            <th style="border: 0px"><span class="no-print">ដល់<br>To</span></th>
                            <td style="border: 0px;text-align: left;" colspan="1" class="headin-no-border fz12">
                                &nbsp;&nbsp;&nbsp;&nbsp;{{dateFormatter(doc.newReadingDate)}}
                            </td>
                        </tr>
                        <tr style="border: 0px; height: 13px">
                            <td colspan="34"></td>
                        </tr>
                        <tr>
                            <th colspan="7" class="heading-report" width="15%"><span
                                    class="no-print">នាឡិកា/Meter</span>
                            </th>
                            <th colspan="10" class="heading-report" width="35%"><span
                                    class="no-print">អំណានថ្មី/Current Reading</span>
                            </th>
                            <th colspan="10" class="heading-report" width="35%"><span
                                    class="no-print">អំណានចាស់/Previous Reading</span>
                            </th>
                            <td colspan="7" rowspan="2" class="heading-report" width="15%"><span
                                    class="no-print" style="text-align: center"><b>បរិមាណទឹកប្រើប្រាស់</b><br>Consumption</span>
                                <br> {{doc.waterConsumption}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="heading-report fz12"><span
                                    class="no-print "><b>លេខ/No</b></span>
                                <br>{{doc.customerDoc.contract.meterSerialNo}}
                            </td>
                            <td colspan="4" class="fz12 heading-report"><span
                                    class="no-print"><b>ទំហំ/Diameter</b></span>
                                <br>&nbsp;&nbsp;&nbsp;{{doc.customerDoc.contract.meterTypeDoc.diameter}}
                            </td>
                            <td colspan="5" class="fz12 heading-report"><span
                                    class="no-print"><b>កាលបរិច្ឆេទ/Date</b></span>
                                <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dateFormatter(doc.newReadingDate)}}
                            </td>
                            <td colspan="5" class="fz12 heading-report"><span
                                    class="no-print"><b>លេខអាន/Index</b></span>
                                <br>{{doc.newReading}}
                            </td>
                            <td colspan="5" class="fz12 heading-report"><span
                                    class="no-print"><b>កាលបរិច្ឆេទ/Date</b></span>
                                <br>{{dateFormatter(doc.prevReadingDate)}}
                            </td>
                            <td colspan="5" class="fz12 heading-report"><span
                                    class="no-print"><b>លេខអាន/Index</b></span>
                                <br>{{doc.prevReading}}
                            </td>
                        </tr>
                        <tr class="headin-no-border">
                            <th colspan="34"></th>
                        </tr>
                        <tr class="headin-no-border">
                            <th colspan="34"></th>
                        </tr>
                        <tr>
                            <th colspan="18" class="heading-report"><span class="no-print">បរិយាយ/Description</span>
                            </th>
                            <th colspan="5" class="heading-report"><span class="no-print">បរិមាណ/Quantity</span></th>
                            <th colspan="5" class="heading-report"><span class="no-print">តម្លៃឯកតា/Unit Price</span>
                            </th>
                            <th colspan="6" class="heading-report"><span class="no-print">ទឹកប្រាក់/Amount</span></th>
                        </tr>
                        </thead>
                        <tbody class="body-border-outsite">
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left; margin-left: 10px; font-size: 9px; font-family:'segoe UI'">
                                70002
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                តម្លៃទឹកតាមនាឡិកាស្ទង់កំរិត ១
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">
                                METERED CONSUMPTION-TR1
                            </td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.waterConsumption}} M3
                            </td>
                            <td colspan="6" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.price)}}
                            </td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.total)}}
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left;margin-left: 10px;font-size: 9px; font-family:'segoe UI'">71002
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">
                                តម្លៃថែទាំនាឡិកាស្ទង់
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">METER MAINTENANCE
                            </td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.billingCycle}} M
                            </td>
                            <td colspan="6" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{ceilingFormatter(doc.maintenanceFee)}}
                            </td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{ceilingFormatter(doc.maintenanceFee)}}
                            </td>
                        </tr>
                        <tr class="fz9">
                            <td colspan="3"
                                style="text-align: left;margin-left: 10px;font-size: 9px; font-family:'segoe UI'">
                                41001.97
                            </td>
                            <td colspan="7" style="font-family: 'Khmer OS System'; font-size: 9px">វិភាគទានលូទឹកស្អុយ
                            </td>
                            <td colspan="8" style="font-family: 'Khmer OS System'; font-size: 9px">SEWERAGE CHARGE</td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{doc.waterConsumption}} M3
                            </td>
                            <td colspan="6" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.contributionFeePrice)}}
                            </td>
                            <td colspan="5" style="text-align: center;font-family: 'Khmer OS System'; font-size: 9px">
                                {{numFormatter(doc.contributionFee)}}
                            </td>
                        </tr>
                        <tr style="height: 250px;">
                            <td colspan="34">
                            </td>
                        </tr>
                        <tr style="height: 57px">
                            <td colspan="34" style="font-family:'Khmer OS System'; font-size: 9px">
                                ប្រាក់កក់របស់លោកអ្នក :
                            </td>
                        </tr>
                        <tr>
                            <td colspan="18" class="heading-report"><span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </td>
                            <td colspan="10" rowspan="2" class="body-border-no-right"><span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ<br>Amount Charged</span>
                            </td>
                            <td colspan="6" rowspan="2" valign="middle" style="text-align: right;height: 38px;"
                                class="body-border-no-left">
                                {{numFormatter(doc.grandTotal)}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report"><span class="no-print">បេឡាករ/Cashier</span></td>
                            <td colspan="5" class="heading-report"><span class="no-print">កាលបរិច្ឆេទ/Date</span></td>
                            <td colspan="8" class="heading-report"><span
                                    class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span></td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="5" class="heading-report"></td>
                            <td colspan="8" class="heading-report"></td>
                            <th colspan="10" class="body-border-no-right"><span
                                    class="no-print">ជំពាក់(បង់មុន)<br>Arrears(Advances)</span></th>
                            <td class="body-border-no-left" valign="middle" style="text-align: right;height: 38px;"
                                colspan="6">
                                {{numFormatter(doc.grandTotal)}}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="18" class="heading-report"></th>
                            <th colspan="10" class="body-border-no-right"><span
                                    class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប<br>Total Amount</span>
                            </th>
                            <th colspan="6" style="text-align: right; height: 38px;" class="body-border-no-left">
                                {{numFormatter(doc.grandTotal)}}
                            </th>
                        </tr>

                        </tbody>
                        <tbody>
                        <tr class="headin-no-border">
                            <td colspan=" 34"></td>
                        </tr>
                        <tr class="body-border-outsite" style="height: 30px">
                            <td colspan="20">
                                <span class="no-print">សូមអញ្ចើញមកបង់ប្រាក់ឲ្យបានមុនថ្ងៃ/Please pay before: </span>
                            </td>
                            <th colspan="14" style="font-family: 'segoe UI'; font-size: 14px">
                                {{dateFormatter()}}
                            </th>
                        </tr>
                        </tbody>

                        &lt;!&ndash;Bottom To Cut&ndash;&gt;
                        <thead>
                        <tr>
                            <th colspan="34" style="text-align: center;"
                                class=" report-title">

                                <div style="height: 107px;display:flex; align-items: flex-end; justify-content: center;">
                                    <span class="no-print">
                                             អង្គភាពរដ្ឋាករទឹកបាត់ដំបង <br>Battambang Water Supply
                                    </span>
                                </div>

                            </th>
                        </tr>
                        <tr style="height: 10px;">
                            <td colspan="34" class="fz8" style="text-align: right">
                                {{doc.waterConsumption}} M3
                            </td>
                        </tr>
                        <tr style="border: 0">
                            <th style="border: 0px"><span
                                    class="no-print">ឈ្មេាះ<br>Name  </span>
                            </th>
                            <th style="border: 0px;text-align: left" colspan="12" class="fz12">
                                &nbsp;&nbsp;<span
                                    style="font-family: 'Khmer OS Muol'; font-size: 11px">{{doc.customerDoc.khName}}</span><br>
                                &nbsp;&nbsp;<span
                                    style="font-family: 'segoe UI'; font-size: 11px">{{doc.customerDoc.name}}</span>
                            </th>
                            <td style="border: 0px;text-align: right" colspan="3"><span class="no-print">ថ្ងៃធ្វើវិក្កយបត្រ<br>Billing Date</span>
                            </td>
                            <td style="border: 0px; text-align: center;" colspan="8" class="headin-no-border fz12">
                                {{dateFormatter(doc.newReadingDate)}}
                            </td>
                            <th colspan="10" rowspan="2" style="text-align: right;" valign="top" class="fz8">
                                <posted-meter-reading-journal-component
                                        :doc="doc"></posted-meter-reading-journal-component>
                            </th>
                        </tr>

                        <tr style="border: 0px">
                            <th style="border: 0px" colspan="3"><span class="no-print">លេខអតិថិជន<br>Customer No</span>
                            </th>
                            <td style="border: 0px;text-align: left" colspan="10" valign="top"
                                class="headin-no-border fz12">
                                {{doc.customerDoc._id}}
                            </td>
                            <td style="border: 0px" colspan="3"><span class="no-print">លេខសំគាល់ទីតាំង<br>Delivery Point Code</span>
                            </td>
                            <td style="border: 0px" colspan="5" valign="top" class="headin-no-border fz12">
                                {{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <th style="border: 0px;text-align: right" colspan="3"><span
                                    class="no-print">លេខវិក្កយបត្រ<br>Bill No</span></th>
                        </tr>
                        <tr style="height: 18px;">
                            <td colspan="34"></td>
                        </tr>
                        </thead>
                        <tbody>

                        <tr>
                            <th colspan="18" class="heading-report"><span class="no-print">ការបង់ប្រាក់/Payment</span>
                            </th>
                            <th colspan="10" rowspan="2" class="body-border-no-right"><span class="no-print">ទឹកប្រាក់ត្រូវបង់លើកនេះ<br>Amount Charged</span>
                            </th>
                            <td colspan="6" rowspan="2" class="body-border-no-left" style="text-align: right">
                                {{numFormatter(doc.grandTotal)}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" class="heading-report"><span class="no-print">បេឡាករ/Cashier</span></td>
                            <td colspan="5" class="heading-report"><span class="no-print">កាលបរិច្ឆេទ/Date</span></td>
                            <td colspan="8" class="heading-report"><span
                                    class="no-print">ទឹកប្រាក់បានបង់/Amount Paid</span></td>
                        </tr>
                        <tr>
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="5" class="heading-report" style="text-align: right"></th>
                            <th colspan="8" class="heading-report" style="text-align: right"></th>
                            <th colspan="10" class="body-border-no-right"><span
                                    class="no-print">ទឹកប្រាក់ត្រូវបង់សរុប<br>Total Amount</span>
                            </th>
                            <th colspan="6" class="body-border-no-left" valign="bottom" style="text-align: right">
                                {{numFormatter(doc.grandTotal)}}
                            </th>
                        </tr>
                        </tbody>
                    </table>

                    <p style="page-break-after:always"></p>
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
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                        aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title" id="postInvoiceLabel"><i class="fa fa-filter"></i>
                                    Post Invoice Filter</h4>
                            </div>

                            <div class="modal-body">
                                <el-form :rules="rules" ref="postedInvoice" :label-position="labelPosition"
                                         label-width="100px" :model="postInvoice">
                                    &lt;!&ndash;<el-row>&ndash;&gt;
                                    <el-form-item label="Date" prop="dateRange">
                                        <el-date-picker
                                                v-model="dateRange"
                                                type="daterange"
                                                align="right"
                                                placeholder="Pick a range"
                                                :picker-options="pickerOptions2">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="Meter Query">
                                        <el-select style="width: 223px" v-model="postInvoice.meterQuery" multiple
                                                   clearable
                                                   placeholder="Select">
                                            <el-option
                                                    v-for="item in meterQueryOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    &lt;!&ndash;</el-row>&ndash;&gt;
                                    <el-form-item label="Customer">
                                        <el-select style="width: 223px" class="customer-select"
                                                   v-model="postInvoice.customer" multiple
                                                   filterable=""
                                                   remote
                                                   placeholder="Please enter a keyword" :remote-method="remoteMethod"
                                                   :loading="loading">
                                            <el-option v-for="item in customers" :key="item.value" :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading"
                                                   @click.native="queryPostInvoice('postedInvoice')">Run
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>

                        </div>&lt;!&ndash; modal-content &ndash;&gt;
                    </div>&lt;!&ndash; modal-dialog &ndash;&gt;
                </div>&lt;!&ndash; modal &ndash;&gt;


            </div>&lt;!&ndash; container &ndash;&gt;
            &lt;!&ndash;End Modal&ndash;&gt;
        </div>
    </div>
</template>

<script>
    import PostedMeterReadingJournalComponent from '/imports/vue/components/print/PostedMeterReadingJournalComponent.vue';
    import numeral from 'numeral';
    export default {
        components: {
            PostedMeterReadingJournalComponent
        },
        data() {
            return {
                rules: {},
                fullscreenLoading: false,
                meterQueryOptions: [],
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
                    meterQuery: [],
                },
                //end form data
                reportData: [],
            };
        },
        methods: {
            lookupMeterQuery({selector}){
                Meteor.call('meterQueryOptions', {selector}, (err, result) => {
                    if (!err) {
                        this.meterQueryOptions = result;
                    }
                });
            },
            queryPostInvoice(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let selector = {};
                        if (this.postInvoice.meterQuery.length > 0) {
                            this.postInvoice.meterQuery.forEach(function (meter) {
                                let obj = JSON.parse(meter);
                                if (!selector.district) {
                                    selector = {
                                        district: {$in: [obj.district],},
                                        block: {$in: [obj.block]},
                                        quartier: {$in: [obj.quartier]}
                                    }
                                } else {
                                    selector['district']['$in'].push(obj.district);
                                    selector['block']['$in'].push(obj.block);
                                    selector['quartier']['$in'].push(obj.quartier);
                                }
                            });
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
                        selector.assignedUsers = {$in: [Meteor.userId()]};
                        if ((this.dateRange.length > 0 ) && this.postInvoice.meterQuery.length > 0 || this.postInvoice.customer.length > 0) {
                            this.fetchPostedMeterReadingJournalDetailById({selector})
                        }
                    } else {
                        console.log("Error Submt")
                    }
                });
            },
            //query customer
            remoteMethod(query) {
                if (query !== '') {
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
            fetchPostedMeterReadingJournalDetailById({selector}){
                this.fullscreenLoading = true;
                setTimeout(() => {
                    Meteor.call('fetchPostedMeterReadingJournalDetailById', {selector}, (err, result) => {
                        if (!err) {
                            this.reportData = result;
                        }
                    });
                    this.fullscreenLoading = false;
                    $('modal').close()
                }, 1000);
            },
            dateFormatter(date){
                return moment(date).format('DD/MM/YYYY')
            },
            numFormatter(val){
                return numeral(val).format('0,0.00')
            },
            ceilingFormatter(val){
                return numeral(val).format('0,0')
            },
            generateBarcodeId(doc){
                return `barcode${doc._id}`;
            },
            isOldBlockExist(doc){
                if (doc.newCustomerSuffix) {
                    return doc.newCustomerId + doc.newCustomerSuffix;
                }
                let dpcArr = doc.dpc.split('');
                let subDpc = dpcArr[0] + dpcArr[1] + " " + dpcArr[2] + dpcArr[3] + " " + dpcArr[4] + dpcArr[5] + " " + doc.folio + " " + doc.successor;
                return subDpc;
            },
            printPostedInvoice(){
                window.print();
            },
            postedInvoiceIsZero(){
                return this.reportData.length <= 0
            }
        },
        computed: {
            generateBarcodeSvg(doc){
                return `barcode${doc._id}`;
            },
        },
        //life cycle
        created(){
            let mrjdId = FlowRouter.query.get('mrjd'); //mrjd = Meter Readiing Journal Detal
            if (mrjdId) {
                let selector = {_id: mrjdId};
                this.fetchPostedMeterReadingJournalDetailById({selector});
            }
            this.lookupMeterQuery({selector: {assignUser: {$in: [Meteor.userId()]}}})
        },
        mounted(){
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

    tr, td {
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
