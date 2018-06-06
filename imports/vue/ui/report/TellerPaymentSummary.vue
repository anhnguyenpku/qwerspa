<!--suppress ALL -->
<template>
    <div class="teller-payment-summary-report">
        <a4>
            <div slot="header">
                <el-row type="flex" class="no-print row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                           Teller Payment Summary Filter <i class="header-icon el-icon-information"></i>
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
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="padding: 10px;">
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
                             style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 16px;margin-bottom: 5px;text-decoration: underline;">
                            ប័ណ្ណបង់ប្រាក់
                        </div>
                    </div>
                <div class="row">
                    <div class="col-md-12" style="font-family: 'Khmer OS Battambang';float: right;">
                        <small style="font-size: 11px;">កាលបរិច្ឆេទៈ {{printDate}}</small>
                    </div>
                </div>


                    <table border="1" style="font-size:11px;width: 100%">
                        <thead>
                        <tr style="font-family: 'Khmer OS Battambang';font-size: 12px;">
                            <th></th>
                            <th>ទីតាំងសំគាល់</th>
                            <th class="text-center">ចំនួនវិក្កយបត្រ</th>
                            <th class="text-center">បរិមាណទឹក(M3)</th>
                            <th class="text-center">ថ្លៃថែទាំ</th>
                            <th class="text-center">វិភាគទានលូទឹកស្អុយ</th>
                            <th class="text-center">ថ្លៃប្រើប្រាស់ទឹក</th>
                            <th class="text-center">ទឹកប្រាក់ត្រូវបង់</th>
                            <th class="text-center">ទឹកប្រាក់បានបង់</th>
                            <!-- <th>Saving</th>
                             <th>Balance</th>-->
                        </tr>
                        </thead>
                        <tbody style="font-size:11px;">
                             <slot v-for="type in payments">
                                <tr style="font-family: 'Khmer OS Muol';font-size:11px;text-decoration: underline">
                                    <td colspan="9">ប្រភេទវិក្កយបត្រៈ {{type._id == "expired" ? "ផុតកំណត់" : "ធម្មតា"}}</td>
                                </tr>
                            <slot v-for="payment in type.users">
                                <tr style="font-family: 'Khmer OS Muol';font-size:11px;">
                                    <td colspan="9">អ្នកទារប្រាក់ៈ {{payment.userDoc.fullName || payment.userDoc.username}}</td>
                                </tr>
                                <slot v-for="date in payment.dates">
                                    <tr style="font-family: 'Khmer OS Muol';text-decoration: underline">
                                        <td></td>
                                        <td colspan="8">វិក្កយបត្រ​ក្នុងខែៈ {{date.month}}/{{date.year}}</td></tr>
                                    <slot v-for="detail in date.data">
                                    <tr>
                                        <td></td>
                                        <td class="text-center">{{detail.blockDoc && detail.blockDoc.districtDoc.code}}{{detail.blockDoc && detail.blockDoc.quartierDoc.code}}{{detail.blockDoc.code}}</td>
                                        <td class="text-center">{{detail.numberOfInvoice}}</td>
                                        <td class="text-right">{{detail.waterConsumption | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.maintenanceFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.contributionFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.total | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.dueAmount | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.paidAmount | numFormatRiel}}</td>
                                        <!--  <td>{{detail.balance}}</td>-->
                                    </tr>
                                    </slot>
                                    <tr style="border-top: 1px solid black;background: #f5f5f5;text-decoration: underline;">
                                         <td></td>
                                        <td style="font-weight: bold;">សរុបៈ</td>
                                        <td class="text-center">{{date.totalByMonthNumberOfInvoice }}</td>
                                        <td class="text-right">{{date.totalByMonthWaterConsumption | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalByMonthMaintenanceFee | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalByMonthContributionFee | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalByMonthTotal | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalByMonthDueAmount | numFormatRiel}}</td>
                                        <td class="text-right">{{date.totalByMonthPaidAmount | numFormatRiel}}</td>
                                    </tr>
                                </slot>
                                 <tr style="border-top: 1px solid black;background: #f5f5f5;font-weight: bold;font-size: 11px;">
                                     <td style="font-weight: normal;font-family: 'Khmer OS Muol';">សរុបៈ</td>
                                      <td></td>
                                    <td class="text-center">{{payment.totalByUserNumberOfInvoice }}</td>
                                    <td class="text-right">{{payment.totalByUserWaterConsumption | numFormatRiel}}</td>
                                    <td class="text-right">{{payment.totalByUserMaintenanceFee | numFormatRiel}}</td>
                                    <td class="text-right">{{payment.totalByUserContributionFee | numFormatRiel}}</td>
                                    <td class="text-right">{{payment.totalByUserTotal | numFormatRiel}}</td>
                                    <td class="text-right">{{payment.totalByUserDueAmount | numFormatRiel}}</td>
                                    <td class="text-right">{{payment.totalByUserPaidAmount | numFormatRiel}}</td>
                                </tr>
                            </slot>
                                  <tr style="border-top: 1px solid black;background: #f5f5f5;font-weight: bold;font-size: 11px;text-decoration: underline">
                                     <td style="font-weight: normal;font-family: 'Khmer OS Muol';">សរុបៈ</td>
                                      <td></td>
                                    <td class="text-center">{{type.totalByTypeNumberOfInvoice }}</td>
                                    <td class="text-right">{{type.totalByTypeWaterConsumption | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalByTypeMaintenanceFee | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalByTypeContributionFee | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalByTypeTotal | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalByTypeDueAmount | numFormatRiel}}</td>
                                    <td class="text-right">{{type.totalByTypePaidAmount | numFormatRiel}}</td>
                                </tr>
                        </slot>
                            <tr style="border-top: 1px solid black;background: #f5f5f5;font-weight: bold;font-size: 11px;">
                                    <td style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុបរួមៈ</td>
                                    <td></td>
                                    <td class="text-center">{{footer.numberOfInvoice }}</td>
                                    <td class="text-right">{{footer.waterConsumption | numFormatRiel}}</td>
                                    <td class="text-right">{{footer.maintenanceFee | numFormatRiel}}</td>
                                    <td class="text-right">{{footer.contributionFee | numFormatRiel}}</td>
                                    <td class="text-right">{{footer.total | numFormatRiel}}</td>
                                    <td class="text-right">{{footer.dueAmount | numFormatRiel}}</td>
                                    <td class="text-right">{{footer.paidAmount | numFormatRiel}}</td>
                            </tr>

                        </tbody>
                    </table>

                     <table width="100%">
                        <tr style="font-weight: bold;font-size:11px; line-height: 15px;font-family: Khmer os Battambang;">

                            <td colspan="2" style="border: none !important;line-height:16px;">
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
                               <br>  ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
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
                <!-- <div style="position:fixed;bottom: 0;height: 40px;background:#fdb45c;width: 100%">
                     <table style="width: 100%;margin-top: 10px;">
                         <tbody>
                         <tr style="text-align: center;font-size:11px; font-family: Khmer os Muol;line-height: 15px;">
                             <td>  គណនេយ្យទូទាត់<br><br><br>
                             </td>

                             <td> បេឡាធិការ<br><br><br>
                             </td>

                             <td> អ្នកទារប្រាក់<br><br><br> {{fullName}}</td>
                         </tr>
                         </tbody>
                     </table>
                 </div>-->
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
                        /* moment(moment(moment().format('YYYY-MM-DD 16:00:01')).toDate()).add(-1, 'days').toDate(),
                         moment(moment().format('YYYY-MM-DD 16:00')).toDate()*/
                        moment().startOf('days').toDate(),
                        moment().endOf('days').toDate(),
                    ],
                },
                waterBillingSetup: {khName: '', enName: ''},

                footer: {},
                rolesArea: '',
                activeName: '1',
                payments: [],
                loading: false,
                user: null,
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
            },
            user() {
                return Meteor.users.findOne({_id: Meteor.userId()});
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
        computed: {
            dataExist() {
                return this.payments.length > 0;
            },
            printDate() {
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
                let selector = {};
                let vm = this;
                let date = this.params.date;
                if (date.length > 0) {
                    selector.date = {
                        $gte: moment(date[0]).toDate(),
                        $lte: moment(date[1]).toDate()
                    }
                    //selector.createdBy = Meteor.userId();
                    let footer = {}
                    vm.payments = [];
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
                    Meteor.call('fetchTellerPaymentSummary', selector, selector2, (err, result) => {
                        if (result) {
                            this.payments = result.content;
                            result.content.forEach((con) => {
                                con.users.forEach((user) => {
                                    user.dates.forEach((date) => {
                                        date.data.forEach((d) => {
                                            for (let k in d) {
                                                if (!footer[k]) {
                                                    footer[k] = d[k];
                                                } else {
                                                    footer[k] += d[k]
                                                }
                                            }
                                        });
                                    });
                                });
                            });
                            vm.footer = footer;
                        }
                        this.loading = false;
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

<style scoped>
    table > thead > tr.none-border {
        border: none !important;
    }
</style>