<!--suppress ALL -->
<template>
    <div class="payment-summary-report">
        <a4>
            <div slot="header">
                <el-row type="flex" class="no-print row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Payment Summary Filter <i class="header-icon el-icon-info"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-form-item label="Date">

                                            <el-date-picker
                                                    v-model="params.date"
                                                    type="datetimerange"
                                                    :picker-options="pickerDateOptions"
                                                    placeholder="Select datetime range"
                                                    align="right">
                                            </el-date-picker>

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


                    <table border="1" style="width: 100%;font-size:11px;">
                        <thead>
                        <tr style="font-family: 'Khmer OS Battambang';font-size: 12px;">
                            <th>ទីតាំងសំគាល់</th>
                            <th class="text-center">ចំនួនវិក្កយបត្រ</th>
                            <th class="text-center">ម៉ែត្រគូប</th>
                            <th class="text-center">ថ្លៃថែទាំ</th>
                            <th class="text-center">វិភាគទានលូ</th>
                            <th class="text-center">ថ្លៃប្រើប្រាស់ទឹក</th>
                            <th class="text-center">ទឹកប្រាក់ត្រូវបង់</th>
                            <th class="text-center">ទឹកប្រាក់បានបង់</th>
                            <!-- <th>Saving</th>
                             <th>Balance</th>-->
                        </tr>
                        </thead>
                        <tbody>
                            <slot v-for="payment in payments.data">
                                <slot v-for="detail in payment.data">
                                    <tr>
                                        <td class="text-center">{{detail.blockDoc && detail.blockDoc.districtDoc.code}} {{detail.blockDoc && detail.blockDoc.quartierDoc.code}} {{detail.blockDoc.code}}</td>
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
                            </slot>
                        <tr style="border-top: 1px solid black;background: #f5f5f5;font-weight: bold">
                            <td class="text-right"
                                style="text-align: right;font-weight: normal;font-family: 'Khmer OS Muol'">សរុបៈ</td>
                            <td class="text-center">{{footer.numberOfInvoice }}</td>
                            <td class="text-right">{{footer.waterConsumption | numFormatRiel}}</td>
                            <td class="text-right">{{footer.maintenanceFee | numFormatRiel}}</td>
                            <td class="text-right">{{footer.contributionFee | numFormatRiel}}</td>
                            <td class="text-right">{{footer.total | numFormatRiel}}</td>
                            <td class="text-right">{{footer.dueAmount | numFormatRiel}}</td>
                            <td class="text-right">{{footer.paidAmount | numFormatRiel}}</td>
                        </tr>

                        </tbody>
                        <tbody>

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
                              &emsp; &emsp;&emsp; បេឡាធិការ
                               </span>
                            </td>
                            <td>
                                &emsp;
                            </td>
                            <td colspan="2" style="border: none !important;line-height:16px;">
                                <br>
                                ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                                <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                                   &emsp;&emsp;&emsp; អ្នកទារប្រាក់<br><br><br><br>
                                </span>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{user && user.fullName}}
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
                    date: [
                       /* moment(moment(moment().format('YYYY-MM-DD 16:00:01')).toDate()).add(-1, 'days').toDate(),
                        moment(moment().format('YYYY-MM-DD 16:00')).toDate()*/
                        moment().startOf('days').toDate(),
                        moment().endOf('days').toDate(),
                    ],
                    divideUpDown: ''
                },
                footer: {},
                rolesArea: '',
                activeName: '1',
                payments: {
                    data: [],

                },
                waterBillingSetup: {khName: '', enName: '',cutValue:0},
                divideOptions: [
                    {value: "", label: "All"},
                    {value: "down", label: "Down"},
                    {value: "up", label: "Up"}
                ],
                loading: false,
                user: null,
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
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            });
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
                return this.payments.data.length > 0;
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
            rolesArea(val) {
//                this.fetchDistrictData(val);
            }
        },
        methods: {
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
                    vm.payments.data = [];
                    // just custom will update later
                    //----------------------------//
                    let selector2 = {};
                    if (this.params.divideUpDown != "") {
                        let cutValue=this.waterBillingSetup.cutValue+"";
                        selector2.street = this.params.divideUpDown == "up" ? {$gt: cutValue} : {$lte: cutValue};
                    }
                    //---------------------------//
                    Meteor.call('fetchPaymentSummary', selector,selector2,(err, result) => {
                        if (result) {
                            this.payments.data = result.content;
                            result.content.forEach((o) => {
                                o.data.forEach((d) => {
                                    for (let k in d) {
                                        if (!footer[k]) {
                                            footer[k] = d[k];
                                        } else {
                                            footer[k] += d[k]
                                        }
                                    }
                                });

                            })
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