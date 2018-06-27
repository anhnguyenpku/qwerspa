<!--suppress ALL -->
<template>
    <div class="total-appellate-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Total Appellate Report Filter <i class="header-icon el-icon-info"></i>
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
                <table class="table table-report-appellate table-striped table-bordered"
                       style="font-family: Khmer OS Battambang">
                    <thead>
                    <tr>
                        <td colspan="6" rowspan="3" style=" border: 0px !important;"><img
                                style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                alt=""><span
                                style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;">
                            <br><p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p></span></td>
                        <td colspan="3"
                            style=" border: 0px !important ;text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px;"
                            rowspan="3">ព្រះរាជាណាចក្រកម្ពុជា <br> ជាតិ សាសនា ព្រះមហាក្សត្រ</td>
                    </tr>

                    <tr>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colspan="2" style="border: 0px !important;">លេខ..........រ.ទ</td>
                        <td colspan="5"
                            style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px; border: 0px !important;">សរុបដីការអម <br> ប្រចាំខែ {{totalAappellates.monthFooter | switchMonthToKh}} ឆ្នាំ {{totalAappellates.yearFooter | switchNumMultiToKh}}</td>
                        <td colspan="2" style="border: 0px !important;"></td>
                    </tr>
                    <tr>
                        <th>ល.រ</th>
                        <th>បរិយាយ</th>
                        <th>ឯកតា</th>
                        <th>ចំនួនប្លុក</th>
                        <th>ស្ថិតិបណ្តាញ</th>
                        <th>ជីវភាព</th>
                        <th>អាជីវកម្ម</th>
                        <th>ស្ថាប័នរដ្ឋ</th>
                        <th>សរុប</th>
                    </tr>
                    </thead>

                    <tbody>

                    <tr>
                        <td>1-</td>
                        <td>ចំនួនវិក័យប័ត្រ</td>
                        <td class="reportAppellate">វិក័យប័ត្រ</td>
                        <td class="reportAppellate"></td>
                        <td class="reportAppellate">{{totalAappellates.totalRawInvoice | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.invoiceDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.invoiceCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.invoiceAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.totalInvoice | numFormat}}</td>
                    </tr>
                    <tr>
                        <th rowspan="3">2-</th>
                        <th>សរុបបរិមាណទឹក</th>
                        <th class="reportAppellate">m3</th>
                        <th class="reportAppellate"></th>

                        <th class="reportAppellate"></th>
                        <th class="reportAppellate">{{totalAappellates.totalQtyDomestic | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalQtyCommercial | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalQtyAdministrative | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.grandTotalQty | numFormat}}</th>
                    </tr>
                    <tr>
                        <td>&emsp; បរិមាណទឹកកម្រិត១</td>
                        <td class="reportAppellate">m3</td>
                                                <th class="reportAppellate"></th>
                        <th class="reportAppellate"></th>

                        <td class="reportAppellate">{{totalAappellates.levelOneQtyDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelOneQtyCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelOneQtyAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotallevelOneQty | numFormat}}</td>
                    </tr>
                    <tr>
                        <td>&emsp; បរិមាណទឹកកម្រិត២</td>
                        <td class="reportAppellate">m3</td>
                                                <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>


                        <td class="reportAppellate">{{totalAappellates.levelTwoQtyDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelTwoQtyCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelTwoQtyAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotallevelTwoQty | numFormat}}</td>
                    </tr>
                    <tr>
                        <th rowspan="3">3-</th>
                        <th>សរុបទឹកប្រាក់</th>
                        <th class="reportAppellate">រៀល</th>
                                                <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>


                        <th class="reportAppellate">{{totalAappellates.totalPriceDomestic | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalPriceCommercial | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalPriceAdministrative | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.grandTotalPrice | numFormat}}</th>
                    </tr>
                    <tr>
                        <td>&emsp; ថ្លៃទឹកកមក្រិត១</td>
                        <td class="reportAppellate">រៀល</td>
                                                <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>


                        <td class="reportAppellate">{{totalAappellates.levelOnePriceDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelOnePriceCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelOnePriceAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotallevelOnePrice | numFormat}}</td>
                    </tr>
                    <tr>
                        <td>&emsp; ថ្លៃទឹកកម្រិត២</td>
                        <td class="reportAppellate">រៀល</td>
                                                <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>


                        <td class="reportAppellate">{{totalAappellates.levelTwoPriceDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelTwoPriceCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.levelTwoPriceAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotallevelTwoPrice | numFormat}}</td>
                    </tr>
                    <tr>
                        <td>4-</td>
                        <td>ថ្លៃថែទាំកុងទ័រ</td>
                        <td class="reportAppellate">រៀល</td>
                                                <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>


                        <td class="reportAppellate">{{totalAappellates.maintenanceDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.maintenanceCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.maintenanceAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotalMaintenance | numFormat}}</td>
                    </tr>
                    <tr>
                        <td>5-</td>
                        <td>ថ្លៃវិភាគទានលូទឹកស្អុយ</td>
                        <td class="reportAppellate">រៀល</td>
                                               <th class="reportAppellate"></th>
                                                <th class="reportAppellate"></th>

                        <td class="reportAppellate">{{totalAappellates.contributionDomestic | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.contributionCommercial | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.contributionAdministrative | numFormat}}</td>
                        <td class="reportAppellate">{{totalAappellates.grandTotalContribution | numFormat}}</td>
                    </tr>

                    <tr>
                        <td>6-</td>
                        <td>ការភ្ជាប់បណ្តាញថ្មី</td>
                        <td class="reportAppellate">ចំនួន</td>
                                                <th class="reportAppellate"></th>

                        <td class="reportAppellate">{{totalAappellates.totalNewCus | numFormat}}</td>
                        <td class="reportAppellate" colspan="4"></td>
                    </tr>
                    <tr>
                        <th></th>
                        <th class="reportAppellate">សរុប</th>
                        <th class="reportAppellate"></th>
                        <th class="reportAppellate">{{totalAappellates.totalBlock}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalCus | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalDomestic | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalCommercial | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.totalAdministrative | numFormat}}</th>
                        <th class="reportAppellate">{{totalAappellates.grandTotal | numFormat}}</th>
                    </tr>
                    </tbody>
                    <thead>
                        <tr></tr>
                        <tr>
                            <td colspan="2"
                                style="text-align: center; font-size: 11px; border: 0px !important;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{totalAappellates.dayFooter | switchNumMultiToKh}}    ខែ  {{totalAappellates.monthFooter | switchMonthToKh}}   ឆ្នាំ {{totalAappellates.yearFooter | switchNumMultiToKh}}   <br><span
                                    style="font-family: 'Khmer OS System'"><b>អង្គភាពរដ្ឋាករទឹកបាត់ដំបង</b></span><br><span
                                    style="font-family: 'Khmer OS Muol'">ប្រធាន</span></td>
                            <td colspan="3"
                                style="text-align: center; font-size: 11px; border: 0px !important;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{totalAappellates.dayFooter | switchNumMultiToKh}}    ខែ  {{totalAappellates.monthFooter | switchMonthToKh}}   ឆ្នាំ  {{totalAappellates.yearFooter | switchNumMultiToKh}}  <br><span
                                    style="font-family: 'Khmer OS System'"><b>ប្រធាន ផ្នែក គណនេយ្យ</b></span></td>
                            <td colspan="2"
                                style="text-align: center; font-size: 11px; border: 0px !important;;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{totalAappellates.dayFooter | switchNumMultiToKh}}    ខែ  {{totalAappellates.monthFooter | switchMonthToKh}}   ឆ្នាំ  {{totalAappellates.yearFooter | switchNumMultiToKh}}  <br><span
                                    style="font-family: 'Khmer OS System'"><b>ប្រធាន ផ្នែក អាជីវកម្ម</b></span></td>
                            <td colspan="2"
                                style="text-align: center; font-size: 11px; border: 0px !important;">បាត់ដំបង ថ្ងៃទី  {{totalAappellates.dayFooter | switchNumMultiToKh}}    ខែ   {{totalAappellates.monthFooter | switchMonthToKh}}    ឆ្នាំ  {{totalAappellates.yearFooter | switchNumMultiToKh}}   <br><br><b>អ្នកធ្វើតារាង</b><br><br></td>
                        </tr>
                    </thead>
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
                    isContributionFee: "1",
                    date: null,
                },
                rolesArea: '',
                activeName: '1',
                totalAappellates: {
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
            exportToExcel() {
                Meteor.call('giveMeSaleReportAsExcelFile', this.totalAappellates.data, this.totalAappellates.total, (err, workbookBuffer) => {
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
                this.totalAappellates = {};
                this.loading = true;
                console.log(this.params);
                if (this.params.date == "" || this.params.date == undefined) {
                    alertify.error("Date can't not empty!!");
                    this.loading = false;
                    return false;
                }

                Meteor.call('totalAppellateReport', this.params, (err, result) => {
                    if (result) {
                        console.log(result);
                        this.totalAappellates = result;
                    }
                    this.loading = false;
                });
            }
        },
        computed: {
            dataExist() {
                return this.totalAappellates != undefined;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
