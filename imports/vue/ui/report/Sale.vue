<!--suppress ALL -->
<template>
    <div class="sale-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Appellate Report Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-form-item label="Date">

                                            <el-date-picker
                                                    v-model="params.date"
                                                    type="daterange"
                                                    :picker-options="pickerDateOptions"
                                                    placeholder="Select time range"
                                                    align="right">
                                            </el-date-picker>

                                        </el-form-item>
                                        <el-form-item label="District">
                                            <el-select filterable v-model="params.district" placeholder="(Select One)">
                                                <el-option
                                                        v-for="item in districtOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Quartier">
                                            <el-select filterable v-model="params.quartier" placeholder="(Select One)">
                                                <el-option
                                                        v-for="item in quartierOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Block">
                                            <el-select filterable v-model="params.block" placeholder="(Select One)">
                                                <el-option
                                                        v-for="item in blockOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Category">
                                            <el-select filterable v-model="params.category" clearable placeholder="All">
                                                <el-option
                                                        v-for="item in categoryOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <label>វិភាគទានលូទឹកស្អុយ</label>
                                        <el-switch
                                                v-model="params.isContributionFee"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                on-value="1"
                                                off-value="0">
                                        </el-switch>
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
                <table class="table table-report table-striped">
                    <thead>
                    <tr>
                        <td colspan="7" rowspan="3"><img style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                                         alt=""><span
                                style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;"><br>
                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p>
                        </span></td>
                        <!--<td colspan="6" rowspan="3">មន្ទីរឧស្សាហកម្ម និងសិប្បកម្ម <br> អង្គភាពរដ្ឋាករទឹកបាត់ដំបង</td>-->
                        <td>លេខ : </td>
                            <td style="text-align: right">

                            </td>

                    </tr>

                    <tr>
                        <td>ទីតាំងសម្គាល់ :</td>
                        <td style="text-align: right"> {{sales.position}}</td>
                    </tr>
                    <tr>
                        <td>ខែ-ឆ្នាំ : </td>
                        <td style="text-align: right">{{sales.monthYear}}</td>
                    </tr>
                    <tr>
                        <td colspan="9" style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px;">ដីការអម វិក័យប័ត្របង់ប្រាក់ថ្លៃទឹក</td>
                    </tr>
                    <!--<tr>
                        <th colspan="3"></th>
                        <th style="text-align: center !important;">{{sales.totalInvoice}}</th>
                        <th style="text-align: center !important;">{{sales.totalWaterConsumption | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.total | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalMaintenanceFee | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalContributionFee | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalGrandTtoal | numFormat}}</th>
                    </tr>-->
                    <tr>
                        <th>ល.រ<br>No</th>
                        <th>លោក-លោកស្រី<br>Name</th>
                        <th>លេខប្លុក<br>Block or ID</th>
                        <th>លេខវិក័យប័ត្រ<br>Invoice No.</th>
                        <th>បិរមាណ<br>ទឹក (ម3)</th>
                        <th>ទឹកប្រាក់<br> (រេៀល)</th>
                        <th>ថ្លៃថែទាំកុងទ័រ<br>ទឹក (រេៀល)</th>
                        <th>វិភាគទានលូ<br>ទឹកស្អុយ (រេៀល)</th>
                        <th>ទឹកប្រាក់ត្រូវ<br>ទូទាត់ (រេៀល)</th>
                    </tr>
                    </thead>

                    <tbody>
                     <slot v-for="(sale,index) in sales.data">
                          <slot v-if="isBreak(index)" >
                             <span class="show-print" v-if="index==0"  style="position: absolute; margin-top: -185px;margin-left: 705px;">{{showPage(index)}}</span>
                             <span class="show-print" v-else-if="index!=0 && index<30"  style="position: absolute; margin-top: 55px;margin-left: 705px;">{{showPage(index)}}</span>
                             <span class="show-print" v-else style="position: absolute; margin-top: 70px;margin-left: 705px;">{{showPage(index)}}</span>
                         </slot>

                        <tr>
                            <td>{{index + 1}}</td>
                            <td>{{sale.customerDoc.khName | subStringCustomer15}}</td>
                            <td>{{sale.dpc}}</td>
                            <td>{{sales.shortNameCompany}}{{sale._id | subStringBill}}</td>
                            <td style="text-align: center">{{sale.waterConsumption}}</td>
                            <td style="text-align: right">{{sale.total | numFormat}}</td>
                            <td style="text-align: right">{{sale.maintenanceFee | numFormat}}</td>
                            <td style="text-align: right">{{sale.contributionFee | numFormat}}</td>
                            <td style="text-align: right">{{sale.grandTotal | numFormat}}</td>
                        </tr>
                     </slot>
                    <tr>
                        <th colspan="2" style="text-align: center"><b>សរុប</b></th>
                        <th style="text-Xalign: center"><b>ចំនួនវិក័យប័ត្រ </b>
                        </th>
                        <th style="text-align: center !important;">{{sales.totalInvoice}}</th>
                        <th style="text-align: center !important;">{{sales.totalWaterConsumption | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.total | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalMaintenanceFee | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalContributionFee | numFormat}}</th>
                        <th style="text-align: right !important;">{{sales.totalGrandTtoal | numFormat}}</th>
                    </tr>
                    </tbody>
                    <thead>
                        <tr></tr>
                        <tr>
                            <td colspan="3"
                                style="text-align: center; font-size: 10px;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{sales.dayFooter | switchNumMultiToKh}}    ខែ  {{sales.monthFooter | switchMonthToKh}}   ឆ្នាំ {{sales.yearFooter | switchNumMultiToKh}}   <br><span
                                    style="font-family: 'Khmer OS System'">ផ្នែកផែនការ គណនេយ្យ</span><br><span
                                    style="font-family: 'Khmer OS Muol'">ប្រធាន</span></td>
                            <td colspan="3"
                                style="text-align: center; font-size: 10px;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{sales.dayFooter | switchNumMultiToKh}}    ខែ  {{sales.monthFooter | switchMonthToKh}}   ឆ្នាំ  {{sales.yearFooter | switchNumMultiToKh}}  <br><span
                                    style="font-family: 'Khmer OS System'">ផ្នែក អាជីវកម្ម</span><br><span
                                    style="font-family: 'Khmer OS Muol';">ប្រធាន</span></td>
                            <td colspan="3"
                                style="text-align: center; font-size: 10px;">បាត់ដំបង ថ្ងៃទី  {{sales.dayFooter | switchNumMultiToKh}}    ខែ   {{sales.monthFooter | switchMonthToKh}}    ឆ្នាំ  {{sales.yearFooter | switchNumMultiToKh}}   <br><br>អ្នកធ្វើវិក័យប័ត្រ<br><br></td>
                        </tr>
                    </thead>
                </table>

                <!--<el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <h5 align="center"><u>Sale Report</u></h5>
                        <el-table v-loading.body="loading" :data="sales.data" height="500" border
                                  :default-sort="{prop: 'date', order: 'descending'}"
                                  style="width: 100%">
                        <el-table-column prop="customerDoc.khName" label="Kh Name" sortable
                                         width="180"></el-table-column>
                        <el-table-column prop="customerDoc.name" label="Name" width="180"></el-table-column>
                        <el-table-column prop="districtDoc.name" label="District"></el-table-column>
                        <el-table-column prop="quartierDoc.name" label="Quartier"></el-table-column>
                        <el-table-column prop="blockDoc.name" label="Block"></el-table-column>
                            &lt;!&ndash;<el-table-column prop="customerDoc.address" label="Address"></el-table-column>&ndash;&gt;
                        <el-table-column prop="maintenanceFee" label="M-Fee"></el-table-column>
                        <el-table-column prop="contributionFee" label="C-Fee"></el-table-column>
                        <el-table-column prop="total" label="Total"></el-table-column>
                        <el-table-column prop="grandTotal" label="G-Total"></el-table-column>
                        </el-table>
                            <div> Total: {{sales.total}}</div>
                    </el-col>
                </el-row>-->
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
                    isContributionFee: "1",
                    date: null,
                },
                rolesArea: '',
                activeName: '1',
                sales: {
                    data: [],
                    total: 0
                },
                waterBillingSetup: {khName: '', enName: ''},
                districtOptions: [],
                quartierOptions: [],
                blockOptions: [],
                loading: false,
                exportLoading: false,
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
                    },{
                        text: 'This month',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
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
        watch: {
            'params.district'(val) {
                this.fetchQuartierByDistrictId(val);
                this.params.quartier = "";

            },
            'params.quartier'(val) {
                this.fetchBlockByQuariterId(val);
                this.params.block = "";
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
            showPage(index){
                if(index==0 && index<29){
                    return pad(1,3);
                }else{
                    return pad(((index+1)/29)+1,3);
                }


            },
            isBreak(index){
                if(index==0 && index<29){
                    return true;
                }else {
                    return (index + 1) % 29 == 0;
                }
            },
            exportToExcel() {
                Meteor.call('giveMeSaleReportAsExcelFile', this.sales.data, this.sales.total, (err, workbookBuffer) => {
                    if (!err) {
                        //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                        this.saveAs(workbookBuffer, 'SaleReport');
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
                this.sales = {};
                this.sales.data = [];
                this.loading = true;

                if (this.params.block == "" || this.params.date == "" || this.params.district == "" || this.params.quartier == ""  || this.params.date==undefined) {
                    alertify.error("Param can't not empty!!");
                    this.loading = false;
                    return false;
                }

                Meteor.call('saleReport', this.params, (err, result) => {
                    if (result) {
                        this.sales = result;
                    }
                    this.loading = false;
                });
            }
        },
        computed: {
            dataExist() {
                return this.sales.data.length > 0;
            }
        },
        components: {
            a4: PageA4
        },
    }
    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }
</script>
<style scope>
    .show-print {
        display: none;
    }

    @media print {
        .show-print {
            display: block;
        }
    }
</style>

