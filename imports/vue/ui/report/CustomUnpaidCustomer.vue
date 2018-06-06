<!--suppress ALL -->
<template>
    <div class="custom-unpaid-customer-report">
        <a4>
            <div slot="header">
                <el-row type="flex" class="row-bg no-print" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Unpaid Customer Report Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-form-item label="Date">

                                            <el-date-picker
                                                    v-model="params.date"
                                                    type="date"
                                                    placeholder="Select time"
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
                             style="text-align: center;font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 16px; margin-bottom: 5px;text-decoration: underline">
                            របាយការណ៍ អតិថិជនជំពាក់
                        </div>
                    </div>
                <div class="row">
                    <div class="col-md-12" style="font-family: 'Khmer OS Battambang';float: right;">
                        <p>កាលបរិច្ឆេទៈ {{printDate}}</p>
                    </div>
                </div>
                    <table class="table-custom" style="font-size: 11px;">
                        <thead>
                        <tr style="font-family: 'Khmer OS Battambang';text-align: center">
                            <th>លរ.</th>
                            <th>ឈ្មោះ</th>
                            <th>លេខផ្លូវ</th>
                            <th>DPC</th>
                            <!--<th>កាលបរិច្ឆេទ</th>-->
                            <th class="text-center">ម៉ែត្រគូប</th>
                            <th class="text-center">ថែទាំ</th>
                            <th class="text-center">វិភាគទានលូ</th>
                            <th class="text-center">ថ្លៃប្រើប្រាស់ទឹក</th>
                            <th class="text-center">ទឹកប្រាក់ត្រូវបង់</th>
                            <!--<th class="text-center">ជំពាក់</th>-->
                            <th class="text-center">ប្រភេទ</th>
                            <!-- <th>Saving</th>
                             <th>Balance</th>-->
                        </tr>
                        </thead>
                        <tbody>
                         <slot v-for="date in unpaidCustomers.data">
                             <tr style="font-family: 'Khmer OS Muol';text-decoration: underline">
                                        <td colspan="11">វិក្កយបត្រ​ក្នុងខែៈ {{date.month}}/{{date.year}}</td></tr>
                        <slot v-for="(detail,index) in date.data">

                                     <tr>
                                         <td>{{index + 1}}</td>
                                        <td style="font-family: 'Khmer OS Battambang';">{{detail.customerDoc.khName}}</td>
                                        <td>{{detail.streetNo}}</td>
                                        <td>{{detail.dpc}}</td>
                                         <!--<td>{{detail.customerDoc.streetNo}}</td>-->
                                         <!--<td class="text-center">{{detail.newReadingDate | momentFormat}}</td>-->
                                        <td class="text-center">{{detail.waterConsumption | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.maintenanceFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.contributionFee | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.total | numFormatRiel}}</td>
                                        <td class="text-right">{{detail.grandTotal | numFormatRiel}}</td>
                                         <!--<td class="text-right">{{detail.balance | numFormatRiel}}</td>-->
                                        <td class="text-center" style="font-family:'Khmer OS Battambang';">
                                            <span v-if="getInvoiceType(detail.newReadingDate)">ផុតកំណត់</span>
                                            <span v-else>ធម្មតា</span>
                                        </td>
                                         <!--  <td>{{detail.balance}}</td>-->
                                    </tr>
                                </slot>
                              <tr style="background: #f5f5f5;font-weight: bold">
                                <td colspan="4" style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុប:</td>
                                   <td class="text-center">{{date.totalWaterConsumption | numFormatRiel}}</td>
                                   <td class="text-right">{{date.totalMaintenanceFee | numFormatRiel}}</td>
                                   <td class="text-right">{{date.totalContributionFee | numFormatRiel}}</td>
                                   <td class="text-right">{{date.totalWaterUsage | numFormatRiel}}</td>
                                   <td class="text-right">{{date.totalGrandTotal | numFormatRiel}}</td>
                                  <!--<td class="text-right">{{date.totalBalance | numFormatRiel}}</td>-->
                                <td></td>
                              </tr>
                        </slot>
                         <!--   <tr style="background: #f5f5f5;font-weight: bold">
                                <td colspan="5" style="font-weight: normal;font-family: 'Khmer OS Muol'">សរុប:</td>
                                   <td class="text-center">{{unpaidCustomers.totalWaterConsumption | numFormatRiel}}</td>
                                   <td class="text-right">{{unpaidCustomers.totalMaintenanceFee | numFormatRiel}}</td>
                                   <td class="text-right">{{unpaidCustomers.totalContributionFee | numFormatRiel}}</td>
                                   <td class="text-right">{{unpaidCustomers.totalWaterUsage | numFormatRiel}}</td>
                                   <td class="text-right">{{unpaidCustomers.totalGrandTotal | numFormatRiel}}</td>
                                <td class="text-right">{{unpaidCustomers.totalBalance | numFormatRiel}}</td>
                                <td></td>
                            </tr>-->
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
                                <br>ថ្ងៃទី.............. ខែ............. ឆ្នាំ ២០១....<br>
                                <span style="font-family: Khmer os Muol light,Khmer os Muol;">
                                   &emsp;&emsp;&emsp; អ្នកទារប្រាក់<br><br><br><br>
                                </span>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{userDoc && userDoc.fullName}}
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
                params: {
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    tariff: '',
                    date: moment().toDate(),
                    divideUpDown: '',
                    month: moment().toDate(),
                },
                waterBillingSetup: {
                    enName: '',
                    khName: '',
                    cutValue:0,
                },
                exportLoading: false,
                rolesArea: '',
                activeName: '1',
                unpaidCustomers: {
                    data: [],
                    totalBalance: 0
                },
                userDoc: null,
                districtOptions: [],
                divideOptions: [
                    {value: "", label: "All"},
                    {value: "down", label: "Down"},
                    {value: "up", label: "Up"}
                ],
                quartierOptions: [],
                blockOptions: [],
                loading: false,
                categoryOptions: [],
                tariffOptions: [],
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
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
            this.getUser();
        },
        methods: {
            getUser() {
                this.userDoc = Meteor.users.findOne({_id: Meteor.userId()});
            },
            getInvoiceType(newReadingDate) {
                let add24days = moment(newReadingDate).startOf('days').add(24, 'days').format('YYYY-MM-DD');
                let date = moment(this.params.date).startOf('days');
                let expired = moment(date).isAfter(add24days);
                return expired;
            },
            exportToExcel() {
                Meteor.call('giveMeUnpaidCustomerReportAsExcelFile', this.unpaidCustomers.data, this.unpaidCustomers.totalBalance, (err, workbookBuffer) => {
                    if (!err) {
                        //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                        this.saveAs(workbookBuffer, 'Unpaid Customer Report');
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
                this.loading = true;
                if (this.params.block == "" || this.params.date == "" || this.params.district == "" || this.params.quartier == "" || this.params.date == undefined) {
                    this.$message({
                        type: 'warning',
                        message: "Please pick date and select District, Quartier and Block!"
                    });
                    this.loading = false;
                    return false;
                }
                console.log(this.params);
                this.unpaidCustomers = {};
                this.unpaidCustomers.data = [];

                // just custom will update later
                //----------------------------//
                let selector2 = {};
                if (this.params.divideUpDown != "") {
                    let cutValue=this.waterBillingSetup.cutValue+"";
                    selector2.street = this.params.divideUpDown == "up" ? {$gt: cutValue} : {$lte: cutValue};

                }
                //---------------------------//

                Meteor.call('customerUnpaidCustomerReport', this.params, selector2, (err, result) => {
                    debugger;
                    if (result) {
                        this.unpaidCustomers = result;
                    }
                    this.loading = false;
                });
            }
        },
        computed: {
            dataExist() {
                return this.unpaidCustomers.data.length > 0;
            },
            printDate() {
                if (this.params.date != "" && this.params.date != null) {
                    return moment(this.params.date).format("DD/MM/YYYY");
                }
                return '';
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>

<style scope>

    .table-custom {
        width: 100%;
        padding: 10px;
    }

    .table-custom > thead > tr > th,
    .table-custom > tbody > tr > th,
    .table-custom > tfoot > tr > th,
    .table-custom > thead > tr > td,
    .table-custom > tbody > tr > td,
    .table-custom > tfoot > tr > td {
        border: 1px solid #000000;
    }

    table {
        page-break-inside: auto
    }

    tr {
        page-break-inside: avoid;
        page-break-after: auto
    }

    thead {
        display: table-header-group
    }

    tfoot {
        display: table-footer-group
    }

    /* @page {
         !*size: 21cm 29.7cm;*!
         margin: 0.5cm 0.5cm 0.5cm 0.5cm; !* change the margins as you want them to be. *!
     }*/
</style>