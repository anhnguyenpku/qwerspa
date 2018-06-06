<!--suppress ALL -->
<template>
    <div class="payment-report">
        <a4>
            <div slot="header">
                <el-row type="flex" class="row-bg no-print" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Payment Report Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-form-item label="Date">

                                            <el-date-picker
                                                    v-model="params.date"
                                                    type="datetimerange"
                                                    :picker-options="pickerDateOptions"
                                                    placeholder="Select time range"
                                                    align="right">
                                            </el-date-picker>

                                        </el-form-item>
                                        <el-form-item label="District">
                                            <el-select filterable v-model="params.district" placeholder="All">
                                                <el-option
                                                        v-for="item in districtOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Quartier">
                                            <el-select filterable v-model="params.quartier" placeholder="All">
                                                <el-option
                                                        v-for="item in quartierOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Block">
                                            <el-select filterable v-model="params.block" placeholder="All">
                                                <el-option
                                                        v-for="item in blockOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Category">
                                            <el-select filterable v-model="params.category" placeholder="All">
                                                <el-option
                                                        v-for="item in categoryOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Cashier">
                                            <el-select filterable v-model="params.userCashier" placeholder="All">
                                                <el-option
                                                        v-for="item in userCashierOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Type">
                                            <el-select filterable v-model="params.type" placeholder="All">
                                                <el-option
                                                        v-for="item in typeOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           size="small">RUN
                                </el-button>
                                <el-button v-show="dataExist" :loading="exportLoading" type="success"
                                           @click="exportToExcel" size="small"><i class="fa fa-file-excel-o"></i>
                                    Export to Excel
                                </el-button>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <span slot="content">
                <div class="row">
                        <div class="col-md-10">
                                     <img style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                          alt="">
                                        <span style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;"><br>
                                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p></span>
                                 </div>
                                 <div class="col-md-2; pull-right"
                                      style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px;">
                                     <span style="text-align: center">
                                         ព្រះរាជាណាចក្រកម្ពុជា <br> ជាតិ សាសនា ព្រះមហាក្សត្រ
                                     </span>

                                </div>
                </div>
                <div class="row">
                        <div class="col-md-12"
                             style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 16px; margin-bottom: 5px;text-decoration: underline;">
                            ប័ណ្ណបង់ប្រាក់ លំអិត
                        </div>
                    </div>
                  <div class="row">
                    <div class="col-md-12" style="font-family: 'Khmer OS Battambang';float: right;">
                        <p>កាលបរិច្ឆេទៈ {{printDate}}</p>
                    </div>
                </div>
                    <table border="1" style="font-size:11px;width: 100%">
                        <thead>
                        <tr style="font-family: 'Khmer OS Battambang';text-align: center">
                            <th colspan="2"></th>
                            <th>លរ.</th>
                            <th>លេខអតិថិជន</th>
                            <th>លេខសំគាល់ទីតាំង</th>
                            <th>ឈ្មោះ</th>
                            <!--<th>លេខផ្លូវ</th>-->
                            <th>វិក្កយបត្រ</th>
                            <th>កាលបរិច្ឆេទ</th>
                            <th class="text-center">បរិមាណទឹក(M3)</th>
                            <th class="text-center">ថ្លៃថែទាំ</th>
                            <th class="text-center">វិភាគទានលូទឹកស្អុយ</th>
                            <th class="text-center">ថ្លៃប្រើប្រាស់ទឹក</th>
                            <th class="text-center">ទឹកប្រាក់ត្រូវបង់</th>
                            <th class="text-center">ទឹកប្រាក់បានបង់</th>
                            <th class="text-center">ជំពាក់</th>
                            <!-- <th>Saving</th>
                             <th>Balance</th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <slot v-for="type in payments.data">
                           <tr style="font-family: 'Khmer OS Muol';font-size:11px;text-decoration: underline">
                               <td colspan="15">ប្រភេទវិក្កយបត្រៈ {{type.type == "expired" ? "ផុតកំណត់" : "ធម្មតា"}}</td>
                           </tr>
                                <slot v-for="date in type.data">
                                     <tr style="font-family: 'Khmer OS Muol';text-decoration: underline">
                                        <td></td>
                                        <td colspan="14">ខែៈ {{date.month}}/{{date.year}}</td>
                                     </tr>
                                      <slot v-for="(detail,index) in date.data">
                                                     <tr>
                                                         <td colspan="2"></td>
                                                         <td>{{index + 1}}</td>
                                                        <td>{{detail.customerDoc._id}}</td>
                                                        <td>{{detail.meterReadingJournalDetailDoc.dpc}}</td>
                                                        <td style="font-family: 'Khmer OS Battambang';">{{detail.customerDoc.khName}}</td>
                                                         <!--<td>{{detail.customerDoc.streetNo}}</td>-->
                                                        <td class="text-center">{{detail.meterReadingJournalDetailDoc._id | subStringBill}}</td>
                                                        <td class="text-center">{{detail.date | momentFormat}}</td>
                                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.waterConsumption | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.maintenanceFee | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.contributionFee | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.total | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.dueAmount | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.paidAmount | numFormatRiel}}</td>
                                                        <td class="text-right">{{detail.balance | numFormatRiel}}</td>
                                                         <!--  <td>{{detail.balance}}</td>-->
                                                    </tr>
                                      </slot>
                                    <tr style="background: #f5f5f5;font-weight: bold">
                                        <td colspan="2"></td>
                                        <td colspan="6" style="font-weight: bold;">សរុបៈ</td>
                                        <td class="text-right">{{date.totalWaterConsumption | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalMaintenanceFee | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalContributionFee | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalWaterUsage | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalDueAmount | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalPaidAmount | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalBalance | numFormatRiel}}</td>
                                    </tr>
                                </slot>
                                <tr style="background: #f5f5f5;font-weight: bold;text-decoration: underline">
                                    <td></td>
                                    <td colspan="7"
                                             style=";font-weight: normal;font-family: 'Khmer OS Muol'">សរុប:</td>
                                    <td class="text-right">{{type.totalWaterConsumption | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalMaintenanceFee | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalContributionFee | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalWaterUsage | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalDueAmount | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalPaidAmount | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalBalance | numFormatRiel}}</td>
                                </tr>
                        </slot>
                        <tr style="background: #f5f5f5;font-weight: bold">
                            <td colspan="8" style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុបរួម:</td>
                            <td class="text-right">{{payments.totalWaterConsumption | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalMaintenanceFee | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalContributionFee | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalWaterUsage | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalDueAmount | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalPaidAmount | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalBalance | numFormatRiel}}</td>
                        </tr>
                        </tbody>

                    </table>
                 <table width="100%">
                        <tr style="font-weight: bold;font-size:11px; line-height: 15px;font-family: Khmer os Battambang;">

                            <td colspan="2" style="border: none !important;line-height:16px;">
                                <br>
                               &emsp; &emsp;&emsp;&emsp;បានពិនិត្យត្រឹមត្រូវ <br>
                              &emsp;&emsp;  ថ្ងៃទី............ ខែ............. ឆ្នាំ ២០១....<br>
                               <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                               &emsp;&emsp;&emsp;&emsp; ប្រធានផ្នែក គណនេយ្យ
                               </span>
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                               ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                               <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                               &emsp;&emsp; ប្រធានផ្នែក អាជីវកម្ម
                               </span>
                            </td>
                            <td>
                                &emsp;
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                                ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                                <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                                   &emsp;&emsp;&emsp; អ្នកទារប្រាក់<br><br><br><br>
                                </span>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{user && user.fullName}}
                            </td>
                        </tr>
                        <tr style="font-weight: bold;font-size:11px; line-height: 15px;font-family: Khmer os Battambang;">
                            <td colspan="5" style="border: none !important;line-height:16px;">
                                 &emsp;
                                 &emsp;
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                                 <br>
                                <span>
                                   &emsp;&emsp;&emsp; បានឃេីញ និង ឯកភាព <br>
                                បាត់ដំបង, ថ្ងៃទី............. ខែ............ ឆ្នាំ ២០១....<br>
                                   </span>
                                <span style="font-family: Khmer os Muol light,Khmer os Muol;">&emsp;&nbsp;&nbsp; អង្គភាព រដ្ឋាករទឹកបាត់ដំបង<br>
                               &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ប្រធាន </span>
                            </td>
                             <td style="border: none !important;line-height:16px;">
                            </td>
                        </tr>
                    </table>
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';

    export default {
        mixins: [GenerateFile],
        data() {
            return {
                exportLoading: false,
                params: {
                    userCashier: '',
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    tariff: '',
                    type: '',
                    date: [
                        /*moment(moment(moment().format('YYYY-MM-DD 16:00:01')).toDate()).add(-1, 'days').toDate(),
                        moment(moment().format('YYYY-MM-DD 16:00')).toDate()*/
                        moment().startOf('days').toDate(),
                        moment().endOf('days').toDate(),
                    ],
                },
                waterBillingSetup: {khName: '', enName: ''},
                user: null,
                userCashierOptions: [],
                rolesArea: '',
                activeName: '1',
                payments: {
                    data: [],
                    totalDueAmount: 0,
                    totalPaidAmount: 0,
                    totalBalance: 0,

                },
                typeOptions: [
                    {label: "All", value: ''},
                    {label: "Expired", value: 'expired'},
                    {label: "Normal", value: 'normal'}
                ],
                userCashierOptions: [],
                districtOptions: [],
                quartierOptions: [],
                blockOptions: [],
                loading: false,
                categoryOptions: [],
                tariffOptions: [],
                pickerDateOptions: {
                    shortcuts: [{
                        text: 'Last week',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
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
                    }, {
                        text: 'This month',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Today',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
        },
        computed: {
            dataExist() {
                return this.payments.data.length > 0;
            },
            printDate(){
                if (this.params.date.length > 1) {
                    let startDate = moment(this.params.date[0]).format('DD/MM/YYYY HH:mm');
                    let endDate = moment(this.params.date[1]).format('DD/MM/YYYY HH:mm');
                    return `${startDate}-${endDate}`;
                }
                return '';
            }
        },
        watch: {
            'params.district'(val) {
                this.fetchQuartierByDistrictId(val);
            },
            'params.quartier'(val) {
                this.fetchBlockByQuariterId(val);
            },
            rolesArea(val) {
                this.fetchDistrictData(val);
            }
        },
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            Meteor.call('fetchCategoryData', (err, result) => {
                if (result) {
                    this.categoryOptions = result;
                }
            });
            Meteor.call('fetchUserCashierData', (err, result) => {
                if (result) {
                    this.userCashierOptions = result;
                }
            })
        },
        methods: {
            exportToExcel() {
                Meteor.call('giveMePaymentReportAsExcelFile', this.payments, (err, workbookBuffer) => {
                    if (!err) {
                        //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                        this.saveAs(workbookBuffer, 'Payment');
                    }
                })
            },
            fetchDistrictData(rolesArea) {
                Meteor.call('fetchGeneralDistrictData', {rolesArea}, (err, result) => {
                    if (result) {
                        this.districtOptions = result;
                    }
                });
            },
            fetchQuartierByDistrictId(districtId) {
                Meteor.call('fetchQuartierByDistrictCodeId', districtId, (err, result) => {
                    if (result) {
                        this.quartierOptions = result;
                    }
                });
            },
            fetchBlockByQuariterId(quartierId) {
                Meteor.call('fetchBlockByQuartierCode', quartierId, (err, result) => {
                    if (result) {
                        this.blockOptions = result;
                    }
                });
            },
            handleRun() {
                let vm = this;
                vm.loading = true;
                let selector = {};
                let date = this.params.date;

                if (date.length > 0) {
                    selector.date = {
                        $gte: moment(date[0]).toDate(),
                        $lte: moment(date[1]).toDate()
                    }
                    vm.payments = {};
                    vm.payments.data = [];
                    if (vm.params.userCashier != "") {
                        selector.createdBy = vm.params.userCashier;
                    }
                    if (vm.params.type != '') {
                        selector.type = vm.params.type;
                    }
                    let selector2 = {};
                    if (vm.params.district != '') {
                        selector2['meterReadingJournalDetailDoc.district'] = vm.params.district;
                    }
                    if (vm.params.quartier != '') {
                        selector2['meterReadingJournalDetailDoc.quartier'] = vm.params.quartier;
                    }
                    if (vm.params.block != '') {
                        selector2['meterReadingJournalDetailDoc.block'] = vm.params.block;
                    }
                    if (vm.params.category != '') {
                        selector2['meterReadingJournalDetailDoc.category'] = vm.params.category;
                    }
                    Meteor.call('tellerPaymentReport', selector, selector2, (err, result) => {
                        if (result) {
                            console.log(result);
                            vm.payments = result;
                        }
                        vm.loading = false;
                    });
                }
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
