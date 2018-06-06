<!--suppress ALL -->
<template>
    <div class="posTransactionListByCustomer-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title" style="width: auto !important;">
                            Transaction List By Customer Report Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <!--<el-form :inline="true">-->
                                <el-form :label-position="labelPosition">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-col>
                                            <el-form-item label="Branch">
                                                <el-select filterable v-model="params.branch"
                                                           placeholder="All" clearable style="width: 95%">
                                                    <el-option
                                                            v-for="item in branchOptions"
                                                            :label="item.label"
                                                            :value="item.value" :key="item._id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col>
                                            <el-form-item label="Area">
                                                <el-select filterable v-model="params.area" clearable placeholder="All"
                                                           style="width: 95%">
                                                    <el-option
                                                            v-for="item in areaOptions"
                                                            :label="item.label"
                                                            :value="item.value" :key="item._id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>

                                        </el-col>
                                        <el-col>
                                            <el-form-item label="Date">
                                                <el-date-picker
                                                        align="right" style="width: 95%"
                                                        v-model="params.date"
                                                        type="daterange"
                                                        :picker-options="pickerDateOptions"
                                                        placeholder="Select Date range"
                                                >
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>

                                    </el-row>
                                </el-form>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           style="float: right"
                                           size="small">RUN REPORT
                                </el-button>
                                <!--<el-button v-show="dataExist" :loading="exportLoading" type="success"
                                           @click="exportToExcel" size="small"><i class="fa fa-file-excel-o"></i>
                                    Export to Excel
                                </el-button>-->
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="margin: 0px !important;">
                <table class="table table-report-block-summary table-bordered">
                      <caption>
                          <div class="row">
                                <div class="col-md-12" style="text-align: center !important;">
                                     <!--<img style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                          alt="">-->
                                        <span style="font-family:Khmer os muol; font-size: 15px;margin-left: 20px;"><br>
                                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p>
                                         <p style="font-size: 9px !important; font-family: khmer os Battambang; margin-bottom: 0px !important;">
                                        {{waterBillingSetup.address}}({{waterBillingSetup.phoneNumber}})
                                            </p>
                                        </span>
                                 </div>
                          </div>
                          <div class="row">

                              <div class="col-md-12"
                                   style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px; border: 0px !important;">
                                  <p>Transaction List By Customer</p>
                              </div>

                          </div>
                          <div class="row">
                              <div class="col-md-6;" style="float:right">
                                  Currency: {{currencyHeader}}
                              </div>
                              <div class="col-md-6">
                                  Date: {{dateHeader}}
                              </div>

                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Transaction Type</th>
                        <th>Phone Number</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="transactionListByCustomerHtml">

                </tbody>


            </table>
                 <div class="row" style="width: 100% !important;">
                    <div style="width: 50%;float: left !important;text-align: center !important;">
                        បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>.......................... ថ្ងៃទី ............    ខែ  ....................  ឆ្នាំ ...................<br><span
                            style="font-family: 'Khmer OS Muol'">ប្រធាន</span>
                    </div>

                    <div style="width: 50%;float: right !important;text-align: center !important;">
                        .......................... ថ្ងៃទី  ............ ខែ   ....................  ឆ្នាំ  ...................<br><br><b>រៀបចំដោយ</b><br><br>
                    </div>

                </div>
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
                params: {
                    branch: '',
                    area: '',
                    date: null,
                },
                rolesArea: '',
                activeName: '1',
                transactionListByCustomerHtml: "",
                labelPosition: 'top',
                branchOptions: [],
                areaOptions: [],


                waterBillingSetup: {
                    khName: '',
                    enNamer: ''
                },

                loading: false,
                exportLoading: false,

                checkAll: false,
                isIndeterminate: true,
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
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-1, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick(picker) {
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-4, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'This month',
                        onClick(picker) {
                            const end = moment().endOf("month").toDate();
                            const start = moment().startOf("month").toDate();
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
                },
                dateHeader: "",
                currencyHeader: ""
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
        },
        watch: {

            "params.branch"(val) {
                this.fetchArea(val);
            }
        },
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            this.fetchBranch();
        },
        methods: {

            fetchBranch() {
                Meteor.call("queryRoleBranchOptionReport", (err, result) => {
                    if (result) {
                        this.branchOptions = result;
                    }
                })
            },
            fetchArea(branchList) {
                Meteor.call("queryRoleAreaOptionReport", branchList, (err, result) => {
                    if (result) {
                        this.areaOptions = result;
                    }
                })
            },
            handleRun() {
                this.loading = true;

                if (this.params.date == "" || this.params.date == undefined) {
                    alertify.error("Date can't not empty!!");
                    this.loading = false;
                    return false;
                }
                Meteor.call('posTransactionListByCustomerReport', this.params, (err, result) => {

                    if (result) {
                        this.transactionListByCustomerHtml = result.transactionListByCustomerHTML;
                        this.dateHeader = result.dateHeader;
                        this.currencyHeader = result.currencyHeader;
                    }
                    this.loading = false;
                });
            }


        },
        computed: {
            dataExist() {
                // return this.posSaleData.length > 0;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
