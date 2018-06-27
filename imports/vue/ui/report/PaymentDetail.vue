<!--suppress ALL -->
<template>
    <div class="payment-detail-report">
        <a4 style="padding-bottom:2cm">
            <div slot="header">
                <el-row type="flex" class="no-print row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Payment Detail Report Filter <i class="header-icon el-icon-info"></i>
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
                                        <!-- just custom will update later-->
                                        <el-form-item label="Divide">
                                            <el-select filterable v-model="params.divideUpDown" placeholder="All">
                                                <el-option
                                                        v-for="item in divideOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- --------------------------- -->
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
                    <table border="1" style="font-size: 11px;width: 100%">
                        <thead>
                        <tr style="font-family: 'Khmer OS Battambang';text-align: center">
                            <th>ប្លុក</th>
                            <th>លរ.</th>
                            <th>ឈ្មោះ</th>
                            <th>ថ្ងៃចេញវិក្កយបត្រ</th>
                            <th>លេខសំគាល់ទីតាំង</th>
                            <th>លេខផ្លូវ</th>
                            <!--<th>លេខផ្លូវ</th>-->
                            <th>វិក្កយបត្រ</th>
                            <!--<th>កាលបរិច្ឆេទ</th>-->
                            <th class="text-center">ម៉ែត្រគូប</th>
                            <th class="text-center">ថ្លៃថែទាំ</th>
                            <th class="text-center">វិភាគទានលូ</th>
                            <th class="text-center">ថ្លៃប្រើប្រាស់ទឹក</th>
                            <th class="text-center">ទឹកប្រាក់ត្រូវបង់</th>
                            <th class="text-center">ទឹកប្រាក់បានបង់</th>
                            <!--<th class="text-center">ជំពាក់</th>-->
                            <!-- <th>Saving</th>
                             <th>Balance</th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <slot v-for="block in payments.blocks">
                            <tr>
                                <td colspan="14">{{block.blockDoc && block.blockDoc.districtDoc.code}} {{block.blockDoc && block.blockDoc.quartierDoc.code}} {{block.blockDoc && block.blockDoc.code}}</td>
                            </tr>
                        <slot v-for="(detail,index) in block.data">
                                     <tr>
                                        <td></td>
                                        <td>{{index + 1}}</td>
                                        <td style="font-family: 'Khmer OS Battambang';">{{detail.customerDoc.khName}}</td>
                                        <td>{{detail.meterReadingJournalDetailDoc.newReadingDate |momentFormat }}</td>
                                        <td>{{detail.meterReadingJournalDetailDoc.dpc}}</td>
                                        <td>{{detail.meterReadingJournalDetailDoc.streetNo}}</td>
                                         <!--<td>{{detail.customerDoc.streetNo}}</td>-->
                                        <td class="text-center">{{detail.meterReadingJournalDetailDoc._id | subStringBill}}</td>
                                         <!--<td class="text-center">{{detail.date | momentFormat}}</td>-->
                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.waterConsumption | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.maintenanceFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.contributionFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.meterReadingJournalDetailDoc.total | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.dueAmount | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.paidAmount | numFormatRiel}}</td>
                                        <!--<td class="text-right">{{detail.balance | numFormatRiel}}</td>-->
                                         <!--  <td>{{detail.balance}}</td>-->
                                    </tr>
                            </slot>
                            <tr style="font-weight: bold;">
                                <td colspan="7" style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុប:</td>
                                <td class="text-right">{{block.totalWaterConsumption | numFormatRiel}}</td>
                                <td class="text-right">{{block.totalMaintenanceFee | numFormatRiel}}</td>
                                <td class="text-right">{{block.totalContributionFee | numFormatRiel}}</td>
                                <td class="text-right">{{block.totalWaterUsage | numFormatRiel}}</td>
                                <td class="text-right">{{block.totalDueAmount | numFormatRiel}}</td>
                                <td class="text-right">{{block.totalPaidAmount | numFormatRiel}}</td>
                                <!--<td class="text-right">{{block.totalBalance | numFormatRiel}}</td>-->
                            </tr>
                            </slot>
                        <tr style="background: #f5f5f5;font-weight: bold">
                            <td style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុបរូម:</td>
                            <td colspan="6">{{payments.numberOfInvoice}}</td>
                            <td class="text-right">{{payments.totalWaterConsumption | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalMaintenanceFee | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalContributionFee | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalWaterUsage | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalDueAmount | numFormatRiel}}</td>
                            <td class="text-right">{{payments.totalPaidAmount | numFormatRiel}}</td>
                            <!--<td class="text-right">{{payments.totalBalance | numFormatRiel}}</td>-->
                        </tr>
                    <!-- <tr>
                         <td colspan="13"></td>
                     </tr>


                    <tr style="font-weight: bold;text-align: center;font-size:11px; font-family: Khmer os Battambang;line-height: 15px;">
                        <td colspan="4" style="border: none !important;"> ................., ថ្ងៃទី.......ខែ.......ឆ្នាំ..........<br> គណនេយ្យទូទាត់<br><br><br>
                        </td>

                        <td colspan="5" style="border: none !important;"> .................., ថ្ងៃទី......ខែ.......ឆ្នាំ..........<br> បេឡាធិការ<br><br><br>
                        </td>

                        <td colspan="4" style="border: none !important;"> .................., ថ្ងៃទី......ខែ.......ឆ្នាំ...........<br>អ្នកទារប្រាក់<br><br><br><br> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{user && user.fullName}}</td>
                    </tr>-->
                        </tbody>

                    </table>
                <table width="100%">
                        <tr style="font-weight: bold;font-size:11px; line-height: 15px;font-family: Khmer os Battambang;">

                            <td colspan="2" style="border: none !important;line-height:16px;">
                               &emsp; &emsp;&emsp;&emsp;បានពិនិត្យត្រឹមត្រូវ <br>
                              &emsp;&emsp;  ថ្ងៃទី............ ខែ............. ឆ្នាំ ២០១....<br>
                               <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                               &emsp;&emsp;&emsp;&emsp; គណនេយ្យទូទាត់
                               </span>
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                               ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                               <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                               &emsp;&emsp;&emsp; បេឡាធិការ
                               </span>
                            </td>
                            <td>
                                &emsp;
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                              <br>  ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                                <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                                   &emsp;&emsp;&emsp; អ្នកទារប្រាក់<br><br><br><br>
                                </span>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{user && user.fullName}}
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
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    tariff: '',
                    date: [
                        /* moment(moment(moment().format('YYYY-MM-DD 16:00:01')).toDate()).add(-1, 'days').toDate(),
                         moment(moment().format('YYYY-MM-DD 16:00')).toDate()*/
                        moment().startOf('days').toDate(),
                        moment().endOf('days').toDate(),
                    ],
                    divideUpDown: ''
                },
                waterBillingSetup: {khName: '', enName: '',cutValue:0},
                user: null,
                rolesArea: '',
                activeName: '1',
                payments: {
                    blocks: [],
                },
                divideOptions: [
                    {value: "", label: "All"},
                    {value: "down", label: "Down"},
                    {value: "up", label: "Up"}
                ],
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
            },
            user() {
                return Meteor.users.findOne({_id: Meteor.userId()});
            }
        },
        computed: {
            dataExist() {
                return this.payments && this.payments.blocks.length > 0;
            },
            printDate() {
                if (this.payments) {
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
            });
            Meteor.call('fetchCategoryData', (err, result) => {
                if (result) {
                    this.categoryOptions = result;
                }
            });
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
                vm.payments = {};
                vm.payments.blocks = [];
                if (date.length > 0) {
                    selector.date = {
                        $gte: moment(date[0]).toDate(),
                        $lte: moment(date[1]).toDate()
                    }
                    selector.createdBy = Meteor.userId();
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
                    // just custom will update later
                    //----------------------------//
                    let selector3 = {};
                    if (this.params.divideUpDown != "") {
                        let cutValue=this.waterBillingSetup.cutValue+"";
                        selector3.street = this.params.divideUpDown == "up" ? {$gt: cutValue} : {$lte: cutValue};
                    }
                    //---------------------------//
                    Meteor.call('paymentReport', selector, selector2, selector3, (err, result) => {
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
        mounted() {
            this.$subscribe('wb_userId');
        }
    }
</script>
