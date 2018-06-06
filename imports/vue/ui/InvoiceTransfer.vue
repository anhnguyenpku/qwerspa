<!--suppress ALL -->
<template>
    <div class="invoice-transfer">
        <a4>
            <div slot="header">
                <el-row type="flex" class="no-print row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                           Payment Filter <i class="header-icon el-icon-information"></i>
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

                                        <el-form-item label="Month">
                                            <el-date-picker
                                                    v-model="params.month"
                                                    type="month"
                                                    placeholder="Pick a month">
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

                                        <el-form-item label="Type">
                                            <el-select filterable v-model="params.type" placeholder="All">
                                                <el-option
                                                        v-for="item in typeOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Odd/Even">
                                            <el-select filterable v-model="params.oddEven" >
                                                <el-option
                                                        v-for="item in oddEvenOption"
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

                                <el-button :loading="loading" @click="dialogVisible = true" type="primary"
                                           icon="caret-right"
                                           size="small">Transfer Invoice
                                </el-button>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
                <table border="1" style="font-size: 11px;width: 100%">
                    <thead>
                    <tr style="font-family: 'Khmer OS Battambang';text-align: center">
                        <th>ប្លុក</th>
                        <th>លរ.</th>
                        <th>ឈ្មោះ</th>
                        <!--<th>លេខអតិថិជន</th>-->
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
                    <slot v-for="(detail,index) in payments.data">
                        <tr>
                            <td>{{detail.blockCode}}</td>
                            <td>{{index + 1}}</td>
                            <td style="font-family: 'Khmer OS Battambang';">{{detail.customerDoc.khName}}</td>
                            <!--<td>{{detail.customerDoc._id}}</td>​-->
                            <td>{{detail.meterReadingJournalDetailDoc.dpc}}</td>
                            <td>{{detail.meterReadingJournalDetailDoc.streetNo}}</td>
                            <!--<td>{{detail.customerDoc.streetNo}}</td>-->
                            <td class="text-center">{{detail.meterReadingJournalDetailDoc._id | subStringBill}}</td>
                            <!--<td class="text-center">{{detail.date | momentFormat}}</td>-->
                            <td class="text-right">
                                {{detail.meterReadingJournalDetailDoc.waterConsumption | numFormatRiel}}
                            </td>
                            <td class="text-right">{{detail.meterReadingJournalDetailDoc.maintenanceFee | numFormatRiel}}</td>
                            <td class="text-right">{{detail.meterReadingJournalDetailDoc.contributionFee | numFormatRiel}}</td>
                            <td class="text-right">{{detail.meterReadingJournalDetailDoc.total | numFormatRiel}}</td>
                            <td class="text-right">{{detail.dueAmount | numFormatRiel}}</td>
                            <td class="text-right">{{detail.paidAmount | numFormatRiel}}</td>
                            <!--<td class="text-right">{{detail.balance | numFormatRiel}}</td>-->
                            <!--  <td>{{detail.balance}}</td>-->
                        </tr>
                    </slot>
                    <tr style="background: #f5f5f5;font-weight: bold">
                        <td style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុបរូម:</td>
                        <td colspan="5">{{payments.numberOfInvoice}}</td>
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
            </div>
        </a4>
        <!--Form Modal-->
        <el-dialog
                title="Transfer Your Invoice Payment"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="rulesForm" :rules="rules" ref="rulesForm" label-width="120px"
                     class="ruleForm">
                <el-row>
                    <el-form-item label="Cashier">
                        <el-select filterable v-model="rulesForm.userCashier" placeholder="All">
                            <el-option
                                    v-for="item in userCashierOptions"
                                    :label="item.label"
                                    :value="item.value" :key="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Date" prop="date" required>
                            <el-col>
                                <el-form-item>
                                    <el-date-picker type="date" placeholder="Pick a date"
                                                    v-model="rulesForm.date"
                                                    style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item class="pull-right">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button v-if="dataExist" type="primary" @click="transferInvoice">Confirm</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
        <!--End Form modal-->
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';

    export default {
        mixins: [GenerateFile],
        data() {
            return {
                dialogVisible: false,
                exportLoading: false,
                params: {
                    //userCashier: '',
                    oddEven:'Even',
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    tariff: '',
                    type: 'normal',
                    date: [
                        /*moment(moment(moment().format('YYYY-MM-DD 16:00:01')).toDate()).add(-1, 'days').toDate(),
                         moment(moment().format('YYYY-MM-DD 16:00')).toDate()*/
                        moment().startOf('days').toDate(),
                        moment().endOf('days').toDate(),
                    ],
                    divideUpDown: '',
                    month: moment().toDate(),
                },
                waterBillingSetup: {khName: '', enName: '',cutValue:0},
                divideOptions: [
                    {value: "", label: "All"},
                    {value: "down", label: "Down"},
                    {value: "up", label: "Up"}
                ],
                oddEvenOption: [
                    {value: "Even", label: "Even"},
                    {value: "Odd", label: "Odd"}
                ],
                footer: {},
                rolesArea: '',
                activeName: '1',
                payments: {
                    data: []
                },
                loading: false,
                user: null,
                typeOptions: [
                    {label: "Normal", value: 'normal'},
                    {label: "Expired", value: 'expired'}
                ],
                rulesForm: {
                    date: null,
                    userCashier: null,
                },
                rules: {
                    date: [
                        {type: 'date', required: true, message: 'Please select date', trigger: 'change'},
                    ],
                    userCashier: [
                        {required: true, message: 'Please select Cashier', trigger: 'change'},
                    ]
                },
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
            });
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
                return this.payments.data && this.payments.data.length > 0;
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
            handleClose() {
                this.dialogVisible = false;
            },
            transferInvoice() {
                if(this.rulesForm.userCashier==null || this.rulesForm.userCashier==""){
                    this.$message({
                        duration: 1000,
                        message: `Select Cashier name!`,
                        type: 'warning'
                    });
                    return;
                }
                this.$refs['rulesForm'].validate((valid) => {
                    if (valid && this.payments && this.payments.data) {
                        let currentSelectDate = this.rulesForm.date;
                        this.rulesForm.validateDate = this.rulesForm.date;
                        Meteor.call('transferInvoicePayment', this.rulesForm, this.payments.data, (err, res) => {
                            if (!err) {
                                this.$message({
                                    duration: 1000,
                                    message: `បង្កើតបានជោគជ័យ`,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                            } else {
                                this.$message({
                                    duration: 2000,
                                    message: err.message,
                                    type: 'error'
                                })
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

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
                    selector.createdBy = Meteor.userId();
                    let footer = {}
                    vm.payments = [];
                    /* if (vm.params.userCashier != "") {
                     selector.createdBy = vm.params.userCashier;
                     }*/
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
                    if (this.params.month) {
                        let startMonth = moment(this.params.month).startOf('month').toDate();
                        let endMonth = moment(this.params.month).endOf('month').toDate();
                        selector2['meterReadingJournalDetailDoc.newReadingDate'] = {$gte: startMonth, $lte: endMonth};
                    }
                    // just custom will update later
                    //----------------------------//
                    let selector3 = {};
                    if (this.params.divideUpDown != "") {
                        let cutValue=this.waterBillingSetup.cutValue+"";
                        selector3.street = this.params.divideUpDown == "up" ? {$gt: cutValue} : {$lte: cutValue};
                    }
                    //---------------------------//
                    let oddEven=this.params.oddEven;

                    Meteor.call('fetchPaymentForTransfer', selector, selector2, selector3, (err, result) => {
                        if (result) {
                            let payment = result;
                            let newPayment= {
                                data: [],
                                totalWaterConsumption: 0,
                                totalMaintenanceFee: 0,
                                totalContributionFee: 0,
                                totalWaterUsage: 0,
                                totalPaidAmount: 0,
                                totalDueAmount: 0,
                                totalBalance: 0,
                                numberOfInvoice: 0,
                            }
                            if (payment.data) {
                                payment.data.forEach(function (p) {
                                        if (parseInt(p.blockCode) % 2 == 0 && oddEven == "Even") {
                                            newPayment.data.push(p);
                                            newPayment.totalWaterConsumption += p.meterReadingJournalDetailDoc.waterConsumption;
                                            newPayment.totalMaintenanceFee += p.meterReadingJournalDetailDoc.maintenanceFee;
                                            newPayment.totalContributionFee += p.meterReadingJournalDetailDoc.contributionFee;
                                            newPayment.totalWaterUsage += p.meterReadingJournalDetailDoc.total;
                                            newPayment.totalPaidAmount += p.paidAmount;
                                            newPayment.totalDueAmount += p.dueAmount;
                                            newPayment.totalBalance += p.balance;
                                            newPayment.numberOfInvoice += 1
                                        }
                                        else if (parseInt(p.blockCode) % 2 != 0 && oddEven == "Odd") {
                                            newPayment.data.push(p);
                                            newPayment.totalWaterConsumption += p.meterReadingJournalDetailDoc.waterConsumption;
                                            newPayment.totalMaintenanceFee += p.meterReadingJournalDetailDoc.maintenanceFee;
                                            newPayment.totalContributionFee += p.meterReadingJournalDetailDoc.contributionFee;
                                            newPayment.totalWaterUsage += p.meterReadingJournalDetailDoc.total;
                                            newPayment.totalPaidAmount += p.paidAmount;
                                            newPayment.totalDueAmount += p.dueAmount;
                                            newPayment.totalBalance += p.balance;
                                            newPayment.numberOfInvoice += 1
                                        }
                                    }
                                )
                            }
                            vm.payments = newPayment;
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

<style scoped>
    table > thead > tr.none-border {
        border: none !important;
    }
</style>